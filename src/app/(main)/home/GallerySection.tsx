'use client';
import { Tab, Tabs } from '@nextui-org/tabs';
import React from 'react';
import Gallery from './Gallery';
import { FaImages, FaMap, FaPhotoVideo } from 'react-icons/fa';

export default function GallerySection() {
  return (
    <section id="gallery">
      <div className="px-4"></div>
      <Tabs aria-label="Options" variant="underlined">
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <FaImages />
              <span>Photos</span>
            </div>
          }
        >
          <div className="min-h-screen">
            <Gallery />
          </div>
        </Tab>
        <Tab
          key="map"
          title={
            <div className="flex items-center space-x-2">
              <FaMap />
              <span>Map</span>
            </div>
          }
        >
          <div className="min-h-screen"></div>
        </Tab>
      </Tabs>
    </section>
  );
}
