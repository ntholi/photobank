'use client';
import { Tab, Tabs } from '@nextui-org/tabs';
import { Image } from '@nextui-org/image';
import { CircularProgress } from '@nextui-org/progress';
import React from 'react';
import axios from 'axios';
import { Chip } from '@nextui-org/chip';
import { MdOutlineNoPhotography } from 'react-icons/md';
import NextImage from 'next/image';
import { PhotoStatus } from '@prisma/client';
import { GalleryType } from '@/lib/constants';

interface Photo {
  id: string;
  url: string;
  name: string;
  status: PhotoStatus;
}

type Props = {
  userId: string;
};

export const ProfileBody = ({ userId }: Props) => {
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [loading, setLoading] = React.useState(false);
  let tabs = [
    { title: GalleryType.UPLOADS },
    { title: GalleryType.PURCHASED },
    { title: GalleryType.SAVED },
  ];

  async function handleTabChange(key: string | number) {
    setLoading(true);
    setPhotos([]);
    try {
      const res = await axios.get(`/api/photos/${key}?userId=${userId}`);
      if (res.data.photos.length > 0) {
        setPhotos(res.data.photos as Photo[]);
      }
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
          <Tab key={item.title} title={item.title} className="capitalize">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                          className={'min-w-full h-60 sm:h-72 object-cover'}
                          src={photo.url}
                          alt={photo.name}
                          height={900}
                          width={900}
                          as={NextImage}
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
    case PhotoStatus.pending:
      return 'warning';
    case PhotoStatus.rejected:
      return 'danger';
    default:
      return 'success';
  }
}

export default ProfileBody;
