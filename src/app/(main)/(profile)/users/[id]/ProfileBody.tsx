'use client';
import React, { useState } from 'react';
import { GalleryType } from '@/lib/constants';
import { PhotoWithData } from '@/lib/types';
import {
  Chip,
  Image,
  Skeleton,
  Tab,
  Tabs,
  useDisclosure,
} from '@nextui-org/react';
import { PhotoStatus } from '@prisma/client';
import axios from 'axios';
import { MdOutlineNoPhotography } from 'react-icons/md';
import PhotoModal from '@/app/(main)/photos/PhotoModal';

type Props = {
  userId: string;
};

export const ProfileBody = ({ userId }: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithData | null>(
    null,
  );
  const [photos, setPhotos] = useState<PhotoWithData[]>([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { title: GalleryType.UPLOADS },
    { title: GalleryType.PURCHASED },
    { title: GalleryType.SAVED },
  ];

  async function handleTabChange(key: React.Key) {
    setLoading(true);
    setPhotos([]);
    try {
      const res = await axios.get(`/api/photos/${key}?userId=${userId}`);
      if (res.data.photos.length > 0) {
        setPhotos(res.data.photos as PhotoWithData[]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {selectedPhoto && (
        <PhotoModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          photo={selectedPhoto}
        />
      )}

      <div className='mt-10 flex w-full flex-col'>
        <Tabs
          variant='underlined'
          className='justify-center border-t-1'
          items={tabs}
          onSelectionChange={handleTabChange}
        >
          {(item) => (
            <Tab key={item.title} title={item.title} className='capitalize'>
              {loading ? (
                <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
                  {Array.from(Array(2).keys()).map((i) => (
                    <Skeleton key={i} className='rounded-lg'>
                      <div className='h-60 rounded-lg bg-default-300 sm:h-72'></div>
                    </Skeleton>
                  ))}
                </div>
              ) : (
                <>
                  {photos.length === 0 ? (
                    <div className='mt-20 flex flex-col items-center justify-center text-zinc-400'>
                      <div className='rounded border border-gray-200 bg-gray-50 px-6 py-3'>
                        <MdOutlineNoPhotography className='' size='4rem' />
                        <p className='mt-2 text-center text-xs'>Empty</p>
                      </div>
                    </div>
                  ) : (
                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
                      {photos.map((photo: PhotoWithData) => (
                        <div className='relative' key={photo.id}>
                          {photo.status !== 'published' && (
                            <Chip
                              className='absolute right-2 top-2 z-20 bg-opacity-80 text-xs'
                              color={getChipColor(photo.status)}
                            >
                              {photo.status}
                            </Chip>
                          )}
                          <Image
                            className='aspect-[4/3] size-full cursor-pointer object-cover'
                            src={photo.url}
                            alt={photo.description || 'Lehakoe'}
                            onClick={() => {
                              setSelectedPhoto(photo);
                              onOpen();
                            }}
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
    </>
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
