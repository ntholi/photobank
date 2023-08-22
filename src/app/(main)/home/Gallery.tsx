import api from '@/lib/config/api';
import { Photo } from '@prisma/client';
import NextImage from 'next/image';
import { Image } from '@nextui-org/image';
import React from 'react';

const getPhotos = async () => {
  const response = await fetch(api('photos'), {
    next: { revalidate: 60 * 60 * 24 },
  });
  if (response.ok) {
    const res = await response.json();
    console.log(res);
    if (res.photos) {
      return res.photos as Photo[];
    }
  }
  return [] as Photo[];
};

export default async function Gallery() {
  const photos = await getPhotos();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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
    </div>
  );
}
