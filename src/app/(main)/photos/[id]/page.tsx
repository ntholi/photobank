import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Image } from '@nextui-org/image';
import DetailsCard from './DetailsCard';
import { PhotoWithData } from '@/lib/types';

type Props = { params: { id: string } };

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
    const url = `https://djvt9h5y4w4rn.cloudfront.net/${fileName}.webp`;
    return {
      ...photo,
      url: url,
    };
  }
};

export default async function Page({ params }: Props) {
  const photo = (await getPhoto(params.id)) as PhotoWithData;

  if (!photo) {
    return notFound();
  }

  return (
    <div className="bg-gray-50 ">
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-3">
            <Image src={photo.url} alt={photo.caption || 'Lesotho'} />
          </div>
          <div className="md:col-span-2">
            <DetailsCard photo={photo} />
          </div>
        </div>
      </section>
    </div>
  );
}
