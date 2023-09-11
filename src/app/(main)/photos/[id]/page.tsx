import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Photo } from '@prisma/client';
import { Image } from '@nextui-org/image';

type Props = { params: { id: string } };

const getPhoto = async (id: string): Promise<Photo | null> => {
  const photo = await prisma.photo.findUnique({
    where: { id },
    include: {
      user: true,
      location: true,
    },
  });
  return photo;
};

export default async function Page({ params }: Props) {
  const photo = await getPhoto(params.id);

  if (!photo) {
    return notFound();
  }
  const fileName = photo.fileName.split('.')[0];
  const url = `https://djvt9h5y4w4rn.cloudfront.net/${fileName}.webp`;

  return (
    <>
      <Image src={url} alt={photo.caption || 'Lesotho'} />
    </>
  );
}
