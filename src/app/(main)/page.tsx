import {
  getAllHomeContentWithDetails,
  getHomeContent,
} from '@/server/home-contet/actions';
import { Button } from '@heroui/button';
import React from 'react';
import Hero from './home/Hero';
import Gallery from './Gallary';

export default async function page() {
  const homeContent = await getAllHomeContentWithDetails();
  return (
    <div>
      <Hero content={homeContent} />
      <Gallery />
    </div>
  );
}
