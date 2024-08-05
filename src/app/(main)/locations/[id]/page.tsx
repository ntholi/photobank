import { thumbnail } from '@/lib/config/urls';
import prisma from '@/lib/prisma';
import { PhotoWithData } from '@/lib/types';
import { notFound } from 'next/navigation';
import { MdLocationPin } from 'react-icons/md';
import Gallery from './Gallery';
import ClientOnly from '../../base/ClientOnly';
import { LocationDetails, Photo } from '@prisma/client';
import { Dosis } from 'next/font/google';
import { cn } from '@nextui-org/react';
import Container from '../../base/Container';
import MapDisplay from './MapDisplay';

const titleFont = Dosis({ weight: '700', subsets: ['latin'] });

type Props = { params: { id: string } };

const getLocation = async (id: string) => {
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

async function getLocationDetails(locationId: string) {
  const details = prisma.locationDetails.findUnique({
    where: {
      locationId,
    },
    include: {
      coverPhoto: true,
    },
  });
  return details;
}

export default async function LocationPage({ params: { id } }: Props) {
  const { location, photos } = await getLocation(id);
  const locationDetails = await getLocationDetails(id);
  const cover = getCoverPhoto(photos, locationDetails?.coverPhoto);

  if (!location) {
    return notFound();
  }

  return (
    <div>
      <header
        className="h-[50vh] flex justify-center items-center relative"
        style={{
          backgroundImage: `url(${cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <h1
            className={cn(
              titleFont.className,
              'text-5xl text-white font-bold uppercase border border-gray-100 px-10 py-4',
            )}
          >
            {location.name}
          </h1>
        </div>
      </header>
      {locationDetails && (
        <Container className="grid grid-cols-1 md:grid-cols-2">
          <section>
            <h2 className="text-4xl font-semibold">About {location.name}</h2>
            <article
              dangerouslySetInnerHTML={{ __html: locationDetails.about || '' }}
              className="prose"
            />
          </section>
          <section>
            <MapDisplay location={location} />
          </section>
        </Container>
      )}
      <section className="container mx-auto px-4 py-10">
        <ClientOnly>
          <Gallery photos={photos} />
        </ClientOnly>
      </section>
    </div>
  );
}

function getCoverPhoto(photos: Photo[], photo?: Photo | null) {
  const randomIndex = Math.floor(Math.random() * photos.length);
  const cover = photo || photos[randomIndex];
  return thumbnail(cover.fileName);
}
