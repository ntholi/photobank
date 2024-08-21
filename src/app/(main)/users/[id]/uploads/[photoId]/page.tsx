import { Image, Skeleton } from '@nextui-org/react';
import PhotoUploadForm from './Form';
import prisma from '@/lib/prisma';
import { thumbnail } from '@/lib/config/urls';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type Props = { params: { photoId: string } };

const getPhoto = async (photoId: string) => {
  const photo = await prisma.photo.findUnique({
    where: {
      id: photoId,
    },
  });
  return photo;
};

export default async function Page({ params: { photoId } }: Props) {
  return (
    <section className='grid gap-5 pt-5 md:mt-8 md:px-16 lg:grid-cols-2'>
      <Suspense fallback={<Loader />}>
        <Display photoId={photoId} />
      </Suspense>
    </section>
  );
}

async function Display({ photoId }: { photoId: string }) {
  const photo = await getPhoto(photoId);
  if (!photo) {
    return notFound();
  }
  const photoUrl = thumbnail(photo.fileName);
  return (
    <>
      <div>
        <Image src={photoUrl} alt={'Uploaded Image'} shadow='sm' />
      </div>
      <div>
        <PhotoUploadForm photoId={photoId} />
      </div>
    </>
  );
}

function Loader() {
  return (
    <>
      <div>
        <Skeleton className='h-40 w-full rounded-xl' />
      </div>
      <div className='space-y-3'>
        <Skeleton className='h-8 w-full rounded-lg' />
        <Skeleton className='h-8 w-full rounded-lg' />
      </div>
    </>
  );
}
