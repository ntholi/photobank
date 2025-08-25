'use client';

import { Tabs, Tab } from '@heroui/tabs';
import { IoInformationCircleSharp } from 'react-icons/io5';
import { MdDirections, Md360 } from 'react-icons/md';
import AboutTab from '@/app/(main)/locations/[id]/tabs/AboutTab';
import DirectionTab from '@/app/(main)/locations/[id]/tabs/DirectionTab';
import VirtualTourTab from '@/app/(main)/locations/[id]/tabs/VirtualTourTab';
import { locations, content as contentSchema } from '@/db/schema';

type Location = typeof locations.$inferSelect;
type Content = typeof contentSchema.$inferSelect;

type Props = {
  location: Location & {
    coverContent: Content | null;
    about: string | null;
    virtualTourUrl?: string | null;
  };
};

export default function LocationTabs({ location }: Props) {
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
          <AboutTab location={location} />
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
          <DirectionTab location={location} />
        </Tab>
        {location.virtualTourUrl ? (
          <Tab
            key='virtual-tour'
            title={
              <div className='flex items-center gap-2 text-xs tracking-wide uppercase'>
                <Md360 size={16} />
                <span>Virtual Tour</span>
              </div>
            }
          >
            <VirtualTourTab location={location} />
          </Tab>
        ) : null}
      </Tabs>
    </div>
  );
}
