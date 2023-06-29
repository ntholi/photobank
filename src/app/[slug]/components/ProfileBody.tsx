'use client';

import { BaseProps } from '@/lib/BaseProps';
import { Tab } from '@headlessui/react';
import React from 'react';

export const ProfileBody: React.FC<BaseProps> = ({ className }) => {
  return (
    <div className={`${className}`}>
      <Tab.Group>
        <Tab.List>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          <Tab>Tab 3</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>Content 1</Tab.Panel>
          <Tab.Panel>Content 2</Tab.Panel>
          <Tab.Panel>Content 3</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProfileBody;
