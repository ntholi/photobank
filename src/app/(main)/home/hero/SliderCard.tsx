import React from 'react';
import { motion } from 'framer-motion';
import { PhotoWithData } from '@/lib/types';
import MotionImage from './MotionImage';
import { shorten } from '@/utils';

type Props = {
  data: PhotoWithData;
};

function SliderCard({ data }: Props) {
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
      <MotionImage
        height={600}
        width={300}
        layoutId={data.url}
        alt='Transition Image'
        src={data.url}
        className='absolute h-full w-full rounded-2xl object-cover brightness-75'
      />
      <motion.div className='absolute z-10 flex h-full items-end p-4'>
        <motion.div>
          <motion.div
            layout
            className='mb-2 h-[2px] w-3 rounded-full bg-white'
          ></motion.div>
          <motion.h1
            layoutId={data.url + 'data.name'}
            className='text-sm leading-6 text-white'
          >
            {data?.location?.name
              ? data?.location?.name
              : shorten(data.description, 25)}
          </motion.h1>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default SliderCard;
