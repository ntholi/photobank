'use client';

import React from 'react';
import { Tabs, Tab } from '@heroui/tabs';
import MyUploadsContent from './MyUploadsContent';
import MySavedContent from './MySavedContent';

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
        className='w-full'
      >
        <Tab key='uploads' title='My Uploads'>
          <MyUploadsContent userId={userId} />
        </Tab>
        <Tab key='saved' title='Saved'>
          <MySavedContent userId={userId} />
        </Tab>
      </Tabs>
    </div>
  );
}
