import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/utils';

type ContentData = {
  id: string;
  contentId: string;
  content: {
    id: string;
    fileName: string | null;
    s3Key: string;
    thumbnailKey: string;
    type: 'image' | 'video';
    location: {
      id: string;
      name: string;
      address: string | null;
    } | null;
  };
};

type Props = {
  data: ContentData;
};

export default function SliderCard({ data }: Props) {
  const thumbnailUrl = getImageUrl(data.content.thumbnailKey);

  return (
    <motion.div
      className='relative h-52 min-w-[250px] rounded-2xl shadow-md md:h-80 md:min-w-[208px]'
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.4,
        },
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 100,
      }}
    >
      <motion.img
        layoutId={data.content.thumbnailKey}
        alt={data.content.fileName || 'Content image'}
        src={thumbnailUrl}
        className='absolute h-full w-full rounded-2xl object-cover brightness-75'
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/photo_session.svg';
        }}
      />
      <motion.div className='absolute z-10 flex h-full items-end p-4'>
        <motion.div>
          <motion.div
            layout
            className='mb-2 h-[2px] w-3 rounded-full bg-white'
          />

          <motion.h2
            layoutId={`location-${data.content.id}`}
            className='text-lg leading-6 text-white'
          >
            {data.content.location?.name || 'Unknown Location'}
          </motion.h2>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
