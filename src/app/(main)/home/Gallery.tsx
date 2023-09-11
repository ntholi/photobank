'use client';
import api from '@/lib/config/api';
import { Photo, Tag, User } from '@prisma/client';
import NextImage from 'next/image';
import { Image } from '@nextui-org/image';
import React from 'react';
import axios from 'axios';
import StackGrid from 'react-stack-grid';
import PhotoModal from './PhotoModal';
import { useDisclosure } from '@nextui-org/modal';
import { PhotoWithData } from '@/lib/types';

type Props = {
  searchKey: string;
  tag: Tag | null;
};

export default function Gallery({ searchKey, tag }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [photos, setPhotos] = React.useState<PhotoWithData[]>([]);
  const [selectedPhoto, setSelectedPhoto] =
    React.useState<PhotoWithData | null>(null);

  React.useEffect(() => {
    axios.post(`/api/photos/search?searchKey=${searchKey}`, tag).then((res) => {
      setPhotos(res.data.photos);
    });
  }, [searchKey, tag]);

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
        <StackGrid columnWidth={380} monitorImagesLoaded={true}>
          {photos.map((it) => (
            <Image
              key={it.id}
              src={it.url}
              alt={it.caption || 'Lesotho'}
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
