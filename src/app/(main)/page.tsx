import Hero from './home/hero/Hero';
import api from '@/lib/config/api';
import GallerySection from './home/GallerySection';
import Footer from './home/Footer';
import { PhotoWithUser } from '@/lib/types';

const getPhotos = async () => {
  try {
    const res = await fetch(api('/photos'), {
      next: {
        revalidate: 0,
      },
    });

    const data = await res.json();
    if (data.photos.length > 0) {
      return data.photos as PhotoWithUser[];
    }
  } catch (e) {
    console.log(e);
  }

  return [] as PhotoWithUser[];
};

export default async function Page() {
  const photos = (await getPhotos()).slice(0, 7); //Only take seven photos

  return (
    <>
      {photos && photos.length > 0 ? (
        <>
          <Hero sliderData={photos} />
          <GallerySection />
        </>
      ) : (
        <section className="h-screen flex justify-center items-center">
          <p className="text-gray-400 py-10 px-10 border border-gray-200">
            PhotoBank Empty
          </p>
        </section>
      )}
      <Footer className="mt-10" />
    </>
  );
}
