import { api } from '@/lib/constants';
import { Photo } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

const getPhotos = async () => {
  const response = await fetch(api('photos'), {
    next: { revalidate: 60 * 60 * 24 },
  });
  if (response.ok) {
    const photos: Photo[] = await response.json();
    if (photos) return photos;
  }
  return [] as Photo[];
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
