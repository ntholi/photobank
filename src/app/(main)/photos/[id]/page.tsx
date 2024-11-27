import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Image } from '@nextui-org/react';
import DetailsCard from './DetailsCard';
import { PhotoWithData } from '@/lib/types';
import SimilarPhotos from './SimilarPhotos';
import { watermarked } from '@/lib/config/urls';

type Props = { params: Promise<{ id: string }> };

const getPhoto = async (id: string) => {
  const photo = await prisma.photo.findUnique({
    where: { id },
    include: {
      user: true,
      location: true,
    },
  });
  if (photo) {
    const fileName = photo.fileName.split('.')[0];
    const url = watermarked(fileName);
    return {
      ...photo,
      url: url,
    };
  }
};

export default async function Page(props: Props) {
  const params = await props.params;
  const photo = (await getPhoto(params.id)) as PhotoWithData;

  if (!photo) {
    return notFound();
  }

  return (
    <>
      <div className='bg-gray-100'>
        <section className='container mx-auto px-4 py-10 md:px-20'>
          <div className='grid grid-cols-1 gap-10 md:grid-cols-5'>
            <div className='md:col-span-2 lg:col-span-3'>
              <Image src={photo.url} alt={photo.description || 'Lehakoe'} />
            </div>
            <div className='md:col-span-3 lg:col-span-2'>
              <DetailsCard photo={photo} />
            </div>
          </div>
        </section>
      </div>
      <section className='container mx-auto px-4 md:px-20'>
        <h2 className='my-6 text-xl font-semibold'>Similar Photos</h2>
        <SimilarPhotos photo={photo} />
      </section>
    </>
  );
}
