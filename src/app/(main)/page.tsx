import { getAllHomeContentWithDetails } from '@/server/home-contet/actions';
import React from 'react';
import Hero from './home/Hero';
import GallerySection from './home/Gallery/GallerySection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Discover the beauty of Lesotho through stunning photography and virtual tours. Explore locations, culture, and landscapes of the Mountain Kingdom.',
};

export default async function page() {
  const homeContent = await getAllHomeContentWithDetails();

  return (
    <main className='min-h-screen'>
      <Hero content={homeContent} />
      <GallerySection />
    </main>
  );
}
