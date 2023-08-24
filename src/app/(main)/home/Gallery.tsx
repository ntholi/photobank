'use client';
import api from '@/lib/config/api';
import { Photo, User } from '@prisma/client';
import NextImage from 'next/image';
import { Image } from '@nextui-org/image';
import React from 'react';
import axios from 'axios';
import StackGrid from 'react-stack-grid';
import PhotoModal from './PhotoModal';
import { useDisclosure } from '@nextui-org/modal';
import { PhotoWithUser } from '@/lib/types';

export default function Gallery() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [photos, setPhotos] = React.useState<PhotoWithUser[]>([]);
  const [selectedPhoto, setSelectedPhoto] =
    React.useState<PhotoWithUser | null>(null);

  React.useEffect(() => {
    axios.get(api('/photos')).then((res) => {
      setPhotos(res.data.photos);
    });
  }, []);

  return (
    <>
      {selectedPhoto && (
        <PhotoModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          photo={selectedPhoto}
        />
      )}
      <section
        className="px-2"
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      >
        <StackGrid columnWidth={470} monitorImagesLoaded={true}>
          {photos.map((it) => (
            <Image
              key={it.id}
              src={it.url}
              alt={it.name}
              width={600}
              height={600}
              className="cursor-pointer"
              onClick={() => {
                setSelectedPhoto(it);
                onOpen();
              }}
            />
          ))}
        </StackGrid>
      </section>
    </>
  );
}
