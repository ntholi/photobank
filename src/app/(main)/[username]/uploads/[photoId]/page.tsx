import { Image } from '@nextui-org/react';
import PhotoUploadForm from './Form';
import prisma from '@/lib/db';
import { thumbnail } from '@/lib/config/urls';
import { notFound } from 'next/navigation';

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
  const photo = await getPhoto(photoId);
  if (!photo) {
    return notFound();
  }
  const photoUrl = thumbnail(photo.fileName);

  return (
    <section className="md:px-16 pt-5 md:mt-8 lg:grid grid-cols-11 space-y-5 gap-5">
      <div className={'col-span-5'}>
        <Image src={photoUrl} alt={'Uploaded Image'} shadow="sm" />
      </div>
      <div className={'rounded-xl col-span-6'}>
        <PhotoUploadForm photoId={photoId} />
      </div>
    </section>
  );
}
