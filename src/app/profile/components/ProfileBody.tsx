'use client';
import { Tab, Tabs } from '@nextui-org/tabs';
import { Image } from '@nextui-org/image';
import { CircularProgress } from '@nextui-org/progress';
import React from 'react';
import axios from 'axios';
import { Chip } from '@nextui-org/chip';
import { MdOutlineNoPhotography } from 'react-icons/md';

enum PhotoStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

interface Photo {
  id: string;
  url: string;
  name: string;
  status: PhotoStatus;
}

export const ProfileBody = () => {
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [loading, setLoading] = React.useState(false);
  let tabs = [{ title: 'Uploads' }, { title: 'Bought' }, { title: 'Saved' }];

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
            {loading ? (
              <div className="sm:pt-24 flex justify-center">
                <CircularProgress aria-label="Loading..." />
              </div>
            ) : (
              <>
                {photos.length === 0 ? (
                  <div className="mt-20 flex flex-col justify-center items-center text-zinc-400">
                    <div className="border border-gray-200 bg-gray-50 rounded px-6 py-3">
                      <MdOutlineNoPhotography className="" size="4rem" />
                      <p className="text-center text-xs mt-2">Empty</p>
                    </div>
                  </div>
                ) : (
                  <div className="md:grid grid-cols-3 gap-3">
                    {photos.map((photo: Photo) => (
                      <div className="relative flex flex-1" key={photo.id}>
                        {photo.status !== 'approved' && (
                          <Chip
                            className="absolute top-2 right-2 z-20 text-xs bg-opacity-80"
                            color={getChipColor(photo.status)}
                          >
                            {photo.status}
                          </Chip>
                        )}
                        <Image
                          className={'w-full h-full object-cover'}
                          src={photo.url}
                          alt={photo.name}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

function getChipColor(status: PhotoStatus) {
  switch (status) {
    case PhotoStatus.PENDING:
      return 'warning';
    case PhotoStatus.REJECTED:
      return 'danger';
    default:
      return 'success';
  }
}

export default ProfileBody;
