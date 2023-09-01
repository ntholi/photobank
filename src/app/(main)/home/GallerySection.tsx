'use client';
import { Tab, Tabs } from '@nextui-org/tabs';
import React from 'react';
import Gallery from './Gallery';
import { FaImages, FaMap, FaPhotoVideo, FaSearch } from 'react-icons/fa';
import { Divider } from '@nextui-org/divider';
import { Input } from '@nextui-org/input';
import FilterBar from './FilterBar';
import { Tag } from '@prisma/client';

export default function GallerySection() {
  const [searchKey, setSearchKey] = React.useState('');
  const [tag, setTag] = React.useState<Tag | null>(null);
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
            <div className="max-w-3xl mx-auto">
              <Input
                type="text"
                size="lg"
                endContent={<FaSearch color="gray" />}
                variant="bordered"
                placeholder="Search Photos"
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <FilterBar setTag={setTag} />
            </div>

            <div className="mt-10">
              <Gallery searchKey={searchKey} tag={tag} />
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
