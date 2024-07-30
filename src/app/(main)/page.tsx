import Hero from './home/hero/Hero';
import api from '@/lib/config/api';
import GallerySection from './home/GallerySection';
import Footer from './home/Footer';
import { PhotoWithData } from '@/lib/types';

const getPhotos = async () => {
  try {
    const res = await fetch(api('/photos/hero'), {
      next: {
        revalidate: 60 * 60 * 24 * 7, // 1 week
      },
    });

    const data = await res.json();
    if (data.photos.length > 0) {
      return data.photos as PhotoWithData[];
    }
  } catch (e) {
    console.log(e);
  }

  return [] as PhotoWithData[];
};

export default async function Page() {
  const photos = await getPhotos();
  return (
    <>
      {photos && photos.length > 0 ? (
        <>
          <Hero sliderData={photos} />
          <GallerySection />
        </>
      ) : (
        <section className="h-screen flex justify-center items-center">
          <p>Photobank Empty</p>
        </section>
      )}
    </>
  );
}
