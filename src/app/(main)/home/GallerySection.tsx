'use client';
import { Divider, Input, Tab, Tabs } from '@nextui-org/react';
import { Tag } from '@prisma/client';
import React, { useEffect } from 'react';
import { FaImages, FaMap, FaSearch } from 'react-icons/fa';
import FilterBar from './FilterBar';
import Gallery from './Gallery';
import MapWrapper from './map/MapWrapper';

export default function GallerySection() {
  const [searchKey, setSearchKey] = React.useState('');
  const [tag, setTag] = React.useState<Tag | null>(null);

  useEffect(() => {}, [tag]);

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
            <div className="max-w-5xl mx-auto">
              <Input
                type="text"
                size="lg"
                endContent={<FaSearch color="gray" />}
                variant="bordered"
                placeholder="Search Photos"
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <FilterBar setSelected={setTag} selected={tag} />
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
          <div className="container mx-auto px-2 md:px-24">
            <MapWrapper />
          </div>
        </Tab>
      </Tabs>
    </section>
  );
}
