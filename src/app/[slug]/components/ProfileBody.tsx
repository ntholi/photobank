'use client';

import { Tab } from '@headlessui/react';
import React from 'react';

export const ProfileBody: React.FC<BaseProps> = ({ className }) => {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  return (
    <div className={`${className}`}>
      <Tab.Group>
        <Tab.List className='border-t pt-3 border-zinc-300'>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          <Tab>Tab 3</Tab>
        </Tab.List>
        <Tab.Panels>
          {items.map((item) => (
            <Tab.Panel key={item}>{item}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProfileBody;
