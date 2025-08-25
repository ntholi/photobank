'use client';

import { Tabs, Tab } from '@heroui/tabs';
import { IoInformationCircleSharp } from 'react-icons/io5';
import { MdDirections, Md360 } from 'react-icons/md';
import AboutTab from '@/app/(main)/locations/[id]/tabs/AboutTab';
import DirectionTab from '@/app/(main)/locations/[id]/tabs/DirectionTab';
import VirtualTourTab from '@/app/(main)/locations/[id]/tabs/VirtualTourTab';

type Props = {
  name: string;
  about?: string | null;
  address?: string | null;
  latitude: number;
  longitude: number;
  placeId?: string;
  virtualTourUrl?: string | null;
};

export default function LocationTabs({
  name,
  about,
  address,
  latitude,
  longitude,
  placeId,
  virtualTourUrl,
}: Props) {
  return (
    <div className='w-full'>
      <Tabs
        aria-label='Location tabs'
        fullWidth
        radius='none'
        variant='underlined'
        className='w-full'
        classNames={{
          tabList: 'justify-start gap-8',
          tab: 'h-12 data-[selected=true]:text-foreground',
          cursor: 'bg-foreground',
          panel: 'pt-4',
        }}
      >
        <Tab
          key='about'
          title={
            <div className='flex items-center gap-2 text-xs tracking-wide uppercase'>
              <IoInformationCircleSharp size={16} />
              <span>About</span>
            </div>
          }
        >
          <AboutTab name={name} about={about} />
        </Tab>
        <Tab
          key='directions'
          title={
            <div className='flex items-center gap-2 text-xs tracking-wide uppercase'>
              <MdDirections size={16} />
              <span>Directions</span>
            </div>
          }
        >
          <DirectionTab
            address={address}
            latitude={latitude}
            longitude={longitude}
            placeId={placeId}
          />
        </Tab>
        {virtualTourUrl ? (
          <Tab
            key='virtual-tour'
            title={
              <div className='flex items-center gap-2 text-xs tracking-wide uppercase'>
                <Md360 size={16} />
                <span>Virtual Tour</span>
              </div>
            }
          >
            <VirtualTourTab url={virtualTourUrl} name={name} />
          </Tab>
        ) : null}
      </Tabs>
    </div>
  );
}
