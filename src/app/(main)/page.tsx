import Hero from './home/hero/Hero';
import api from '@/lib/config/api';
import { Photo } from '@prisma/client';
import GallerySection from './home/GallerySection';
import Image from 'next/image';

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
  const photos = (await getPhotos()).slice(0, 7); //Only take seven photos
  const sliderData = photos.map((it) => ({
    img: it.url,
    title: it.name,
    description: it.description || '',
    location: it.location || '',
  }));

  return (
    <>
      {sliderData && sliderData.length > 0 ? (
        <>
          <Hero sliderData={sliderData} />
          <GallerySection />
        </>
      ) : (
        <section className="h-screen flex justify-center items-center">
          <p className="text-gray-400 py-10 px-10 border border-gray-200">
            PhotoBank Empty
          </p>
        </section>
      )}
    </>
  );
}
