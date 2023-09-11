import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Image } from '@nextui-org/image';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import Link from 'next/link';
import { profilePath } from '@/lib/constants';
import { Avatar } from '@nextui-org/avatar';
import PricingPlans from './PricingPlans';

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
  const photo = await getPhoto(params.id);

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

          <Card className="md:col-span-2">
            <CardHeader className="flex gap-3">
              <Avatar src={photo.user.image || ''} />
              <div className="flex flex-col">
                <p className="text-md">
                  {photo.caption || <span>No Caption</span>}
                </p>
                <Link
                  href={profilePath(photo.user)}
                  target="_blank"
                  className="text-small text-default-500"
                >
                  @{photo.user?.username || ''}
                </Link>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <PricingPlans />
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
}
