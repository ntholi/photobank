import React from 'react';
import { motion } from 'framer-motion';
import { CurrentSlideData, PhotoWithData } from '@/lib/types';
import MotionImage from './MotionImage';

type Props = {
  transitionData: PhotoWithData;
  currentSlideData: CurrentSlideData;
};

function BackgroundImage({ transitionData, currentSlideData }: Props) {
  return (
    <>
      {transitionData && (
        <MotionImage
          fill
          sizes="100vw"
          key={transitionData.url}
          layoutId={transitionData.url}
          alt="Transition Image"
          transition={{
            opacity: { ease: 'linear' },
            layout: { duration: 0.6 },
          }}
          className=" absolute left-0 top-0 z-10 h-full w-full object-cover brightness-75"
          src={transitionData.url}
        />
      )}
      <MotionImage
        alt="Current Image"
        height={600}
        width={600}
        key={currentSlideData.data.url + 'transition'}
        src={currentSlideData.data.url}
        className=" absolute left-0 top-0 h-full w-full object-cover brightness-50"
      />
    </>
  );
}

export default BackgroundImage;
