'use client';
import { Tab, Tabs } from '@nextui-org/react';
import React from 'react';
import { FaImage } from 'react-icons/fa6';
import { GrThreeD } from 'react-icons/gr';
import ClientOnly from '../../base/ClientOnly';
import Gallery from './Gallery';
import { Location, Photo, Tag } from '@prisma/client';
import VirtualTour from './VirtualTour';

type Props = {
  tourUrl: string | undefined | null;
  location: Location;
};
export default function LocationBody({ tourUrl, location }: Props) {
  return (
    <Tabs
      aria-label="Options"
      variant="underlined"
      className="pb-3 pt-10 px-14 border-b w-full"
    >
      <Tab
        key="photos"
        title={
          <div className="flex items-center space-x-2 text-medium">
            <FaImage className="text-xl" />
            <span>Photos</span>
          </div>
        }
      >
        <ClientOnly>
          <Gallery location={location} />
        </ClientOnly>
      </Tab>
      <Tab
        key="map"
        title={
          <div className="flex items-center space-x-2 text-medium">
            <GrThreeD className="text-xl" />
            <span>Map</span>
          </div>
        }
      >
        <div className="container mx-auto px-2 md:px-24">
          <ClientOnly>
            <div className="flex justify-center">
              <div className="w-[80vw]">
                <VirtualTour url={tourUrl} />
              </div>
            </div>
          </ClientOnly>
        </div>
      </Tab>
    </Tabs>
  );
}
