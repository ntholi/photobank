import { thumbnail } from '@/lib/config/urls';
import prisma from '@/lib/prisma';
import { PhotoWithData } from '@/lib/types';
import { cn } from '@nextui-org/react';
import { Photo } from '@prisma/client';
import { Dosis } from 'next/font/google';
import { notFound } from 'next/navigation';
import Container from '../../base/Container';
import LocationBody from './LocationBody';
import MapDisplay from './MapDisplay';
import NavButtons from './NavButtons';

const titleFont = Dosis({ weight: '700', subsets: ['latin'] });

type Props = { params: Promise<{ id: string }> };

const getLocation = async (id: string) => {
  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      photos: {
        take: 10,
      },
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

export default async function LocationPage(props: Props) {
  const params = await props.params;

  const { id } = params;

  const { location, photos } = await getLocation(id);
  const locationDetails = await getLocationDetails(id);
  const cover = getCoverPhoto(photos, locationDetails?.coverPhoto);

  if (!location) {
    return notFound();
  }

  return (
    <div>
      <header
        className='relative flex h-[65vh] items-center justify-center'
        style={{
          backgroundImage: `url(${cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='absolute inset-0 bg-black opacity-20'></div>
        <div className='relative z-10 flex flex-col items-center'>
          <h1
            className={cn(
              titleFont.className,
              'border border-gray-100 px-10 py-4 text-5xl font-bold uppercase text-white',
            )}
          >
            {location.name}
          </h1>
        </div>
        <NavButtons />
      </header>
      {locationDetails?.about && (
        <Container
          width='lg'
          className='mt-10 grid grid-cols-1 gap-10 md:grid-cols-3'
        >
          <section className='md:col-span-2'>
            <h2 className='text-4xl font-semibold'>About {location.name}</h2>
            <article
              dangerouslySetInnerHTML={{ __html: locationDetails.about || '' }}
              className='prose mt-5 text-lg'
            />
          </section>
          <section>
            <MapDisplay location={location} />
          </section>
        </Container>
      )}
      <section className='container mx-auto px-4 py-10' id='body'>
        <LocationBody location={location} tourUrl={locationDetails?.tourUrl} />
      </section>
    </div>
  );
}

function getCoverPhoto(photos: Photo[], photo?: Photo | null) {
  const randomIndex = Math.floor(Math.random() * photos.length);
  const cover = photo || photos[randomIndex];
  return thumbnail(cover.fileName);
}
