import { getAllHomeContentWithDetails } from '@/server/home-contet/actions';
import React from 'react';
import Hero from './home/Hero';
import GallerySection from './GallerySection';

export default async function page() {
  const homeContent = await getAllHomeContentWithDetails();

  return (
    <main className='min-h-screen'>
      <Hero content={homeContent} />
      <GallerySection />
    </main>
  );
}
