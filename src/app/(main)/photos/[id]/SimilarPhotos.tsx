import prisma from '@/lib/prisma';
import { PhotoWithData } from '@/lib/types';
import React from 'react';
import { Image } from '@nextui-org/react';
import Link from 'next/link';
import { thumbnail } from '@/lib/config/urls';
import { Prisma } from '@prisma/client';

type Props = {
  photo: PhotoWithData;
};

const getSimilarPhotos = async (photoId: string) => {
  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
    include: {
      labels: true,
    },
  });
  if (!photo) {
    return [];
  }
  const labels = photo.labels.map((it) => it.label);

  const similarPhotos = await prisma.$queryRaw<PhotoWithData[]>`
    SELECT p.*, 
           COUNT(l.label) as matching_labels_count
    FROM "photos" p
    JOIN "photo_labels" l ON p.id = l."photo_id"
    WHERE p.status = 'published'
      AND p.id != ${photoId}
      AND l.label IN (${Prisma.join(labels)})
    GROUP BY p.id
    HAVING COUNT(DISTINCT l.label) >= 3
    ORDER BY matching_labels_count DESC
    LIMIT 20
  `;

  const photos = similarPhotos.map((photo) => ({
    ...photo,
    url: thumbnail(photo.fileName.split('.')[0]),
  }));

  return photos;
};

export default async function SimilarPhotos({ photo }: Props) {
  const photos = await getSimilarPhotos(photo.id);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {photos.map((photo: PhotoWithData) => (
          <Link
            className="relative flex flex-1"
            key={photo.id}
            href={`/photos/${photo.id}`}
          >
            <Image
              className={'min-w-full h-60 sm:h-72 object-cover cursor-pointer'}
              src={photo.url}
              alt={photo.caption || 'Lehakoe'}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
