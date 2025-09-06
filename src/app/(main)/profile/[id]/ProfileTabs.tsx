'use client';

import React from 'react';
import { Tabs, Tab } from '@heroui/tabs';
import MyUploadsContent from './MyUploadsContent';
import MySavedContent from './MySavedContent';
import { IoMdBookmark, IoMdCloudUpload } from 'react-icons/io';

type Props = {
  userId: string;
};

export default function ProfileTabs({ userId }: Props) {
  return (
    <div className='w-full'>
      <Tabs
        aria-label='Profile tabs'
        fullWidth
        radius='none'
        variant='underlined'
        className='w-full'
        classNames={{
          tabList: 'justify-center gap-10',
          tab: 'h-12 data-[selected=true]:text-foreground',
          cursor: 'bg-foreground',
          panel: 'pt-4',
        }}
      >
        <Tab
          key='uploads'
          title={
            <div className='flex items-center gap-2 text-xs tracking-wide uppercase'>
              <IoMdCloudUpload size={16} />
              <span>Uploads</span>
            </div>
          }
        >
          <MyUploadsContent userId={userId} />
        </Tab>
        <Tab
          key='saved'
          title={
            <div className='flex items-center gap-2 text-xs tracking-wide uppercase'>
              <IoMdBookmark size={16} />
              <span>Saved</span>
            </div>
          }
        >
          <MySavedContent userId={userId} />
        </Tab>
      </Tabs>
    </div>
  );
}
