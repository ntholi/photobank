'use client';
import { Tab, Tabs } from '@nextui-org/tabs';
import { Image } from '@nextui-org/react';
import React from 'react';
import { set } from 'react-hook-form';
import axios from 'axios';
import { Console } from 'console';

interface Photo {
  id: string;
  url: string;
  name: string;
}

export const ProfileBody = () => {
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [loading, setLoading] = React.useState(false);
  let tabs = [
    {
      title: 'Uploads',
    },
    { title: 'Bought' },
    { title: 'Saved' },
  ];

  async function handleTabChange(key: string | number) {
    setLoading(true);
    try {
      const res = await axios.get(`/api/photos?type=${key}`);
      setPhotos(res.data as Photo[]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col mt-10">
      <Tabs
        variant="underlined"
        className="border-t-1 justify-center"
        items={tabs}
        onSelectionChange={handleTabChange}
      >
        {(item) => (
          <Tab key={item.title} title={item.title}>
            <div className="">
              {photos.length === 0 ? (
                <p className="text-center text-gray-400 text-sm mt-20">Empty</p>
              ) : (
                <div className="md:grid grid-cols-3 gap-3">
                  {photos.map((photo: Photo) => (
                    <Image
                      key={photo.id}
                      className={'w-full h-full object-cover'}
                      src={photo.url}
                      alt={photo.name}
                    />
                  ))}
                </div>
              )}
            </div>
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

export default ProfileBody;
