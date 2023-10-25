import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react';
import { GoLocation } from 'react-icons/go';
import { MdLocationCity, MdLocationPin } from 'react-icons/md';
import Gallery from './Gallary';
import { PhotoWithData } from '@/lib/types';
import { thumbnail } from '@/lib/config/urls';

type Props = { params: { id: string } };

const getLocation = async (id: number) => {
  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      photos: true,
    },
  });

  const photos = location?.photos.map((it) => {
    const fileName = it.fileName.split('.')[0];
    return {
      ...it,
      url: thumbnail(fileName),
    };
  });

  return { location, photos: photos as PhotoWithData[] };
};

export default async function LocationPage({ params: { id } }: Props) {
  const { location, photos } = await getLocation(parseInt(id));

  if (!location) {
    return notFound();
  }

  return (
    <div>
      <header className="h-44 flex justify-center items-center bg-gradient-to-l from-slate-800 via-violet-700 to-gray-300">
        <div>
          <h1 className="text-3xl text-white">{location.name}</h1>
          <p className="text-gray-100 flex items-center gap-2">
            <MdLocationPin />
            Browse Photos in Location
          </p>
        </div>
      </header>
      <section className="container mx-auto px-4 py-10">
        <Gallery photos={photos} />
      </section>
    </div>
  );
}
