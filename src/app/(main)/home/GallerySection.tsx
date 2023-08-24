'use client';
import { Tab, Tabs } from '@nextui-org/tabs';
import React from 'react';
import Gallery from './Gallery';
import { FaImages, FaMap, FaPhotoVideo, FaSearch } from 'react-icons/fa';
import { Divider } from '@nextui-org/divider';
import { Input } from '@nextui-org/input';

export default function GallerySection() {
  return (
    <section id="gallery" className="pt-10">
      <div className="px-4">
        <Divider />
      </div>
      <Tabs
        aria-label="Options"
        variant="underlined"
        className="pb-3 pt-10 px-14 border-b w-full"
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2 text-medium">
              <FaImages className="text-xl" />
              <span>Photos</span>
            </div>
          }
        >
          <div className="min-h-screen mt-5">
            <Input
              type="text"
              size="lg"
              endContent={<FaSearch color="gray" />}
              variant="bordered"
              placeholder="Search Photos"
              className="max-w-lg mx-auto"
            />
            <div className="mt-10">
              <Gallery />
            </div>
          </div>
        </Tab>
        <Tab
          key="map"
          title={
            <div className="flex items-center space-x-2 text-medium">
              <FaMap className="text-xl" />
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
