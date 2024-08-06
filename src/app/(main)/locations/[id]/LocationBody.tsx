'use client';
import { Tab, Tabs } from '@nextui-org/react';
import { Location } from '@prisma/client';
import { FaImage } from 'react-icons/fa6';
import { GrThreeD } from 'react-icons/gr';
import ClientOnly from '../../base/ClientOnly';
import Gallery from './Gallery';
import VirtualTour from './VirtualTour';
import { useQueryState } from 'nuqs';

type Props = {
  tourUrl: string | undefined | null;
  location: Location;
};
export default function LocationBody({ tourUrl, location }: Props) {
  const [selected, setSelected] = useQueryState('tab');

  return (
    <Tabs
      aria-label="Options"
      variant="underlined"
      className="pb-3 pt-10 px-14 border-b w-full"
      selectedKey={selected}
      onSelectionChange={(key) => setSelected(key as string)}
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
        key="tour"
        title={
          <div className="flex items-center space-x-2 text-medium">
            <GrThreeD className="text-xl" />
            <span>Virtual Tour</span>
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
