import Gallery from './home/Gallery';
import Hero from './home/hero/Hero';
import api from '@/lib/config/api';
import { Photo } from '@prisma/client';
import { Divider } from '@nextui-org/divider';

const getPhotos = async () => {
  const res = await fetch(api('/photos'), {
    next: {
      revalidate: 0,
    },
  });

  const data = await res.json();
  if (data.photos.length > 0) {
    return data.photos as Photo[];
  }

  return [] as Photo[];
};

export default async function Page() {
  const photos = await getPhotos();
  const sliderData = photos.map((it) => ({
    img: it.url,
    title: it.name,
    description: it.description || '',
    location: it.location || '',
  }));

  return (
    <>
      <Hero sliderData={sliderData} />
      <div className="px-4">
        <Divider className="my-10" />
      </div>
      <Gallery />
    </>
  );
}
