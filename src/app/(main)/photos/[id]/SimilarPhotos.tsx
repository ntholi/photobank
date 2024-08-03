import prisma from '@/lib/prisma';
import { PhotoWithData } from '@/lib/types';
import React from 'react';
import { Image } from '@nextui-org/react';
import Link from 'next/link';
import { thumbnail } from '@/lib/config/urls';

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

  const data = await prisma.photo.findMany({
    where: {
      status: 'published',
      labels: {
        some: {
          label: {
            in: labels,
          },
        },
      },
      id: {
        not: photoId,
      },
    },
    take: 20,
  });

  const photos = data.map((it) => {
    const fileName = it.fileName.split('.')[0];
    return {
      ...it,
      url: thumbnail(fileName),
    };
  });

  return photos as PhotoWithData[];
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
              height={900}
              width={900}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
