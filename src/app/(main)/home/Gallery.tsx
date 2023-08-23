'use client';
import api from '@/lib/config/api';
import { Photo } from '@prisma/client';
import NextImage from 'next/image';
import { Image } from '@nextui-org/image';
import React from 'react';
import axios from 'axios';
import StackGrid from 'react-stack-grid';

// const getPhotos = async () => {
//   const response = await fetch(api('photos'), {
//     next: { revalidate: 60 * 60 * 24 },
//   });
//   if (response.ok) {
//     const res = await response.json();
//     if (res.photos) {
//       return res.photos as Photo[];
//     }
//   }
//   return [] as Photo[];
// };

const getPhotos = async () => {
  const res = await axios.get(api('photos'));
  if (res.data.photos.length > 0) {
    return res.data.photos as Photo[];
  }
  return [] as Photo[];
};

export default function Gallery() {
  const [photos, setPhotos] = React.useState<Photo[]>([]);

  React.useEffect(() => {
    getPhotos().then((photos) => setPhotos(photos));
  }, []);

  return (
    <section className="px-2">
      <StackGrid columnWidth={470} monitorImagesLoaded={true}>
        {photos.map((it) => (
          <Image
            key={it.id}
            src={it.url}
            alt={it.name}
            width={600}
            height={600}
            as={NextImage}
          />
        ))}
      </StackGrid>
    </section>
  );
}
