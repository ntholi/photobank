import { api } from '@/lib/constants';
import { Photo } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

const getPhotos = async () => {
  const photos = await fetch(api('photos'));
  return (await photos.json()) as Photo[];
};

export default async function Gallery() {
  const photos = await getPhotos();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {photos.map((it) => (
        <Image key={it.id} src={it.url} alt={it.name} />
      ))}
    </div>
  );
}
