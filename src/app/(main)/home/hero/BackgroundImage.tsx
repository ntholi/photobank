import React from 'react';
import { motion } from 'framer-motion';
import { CurrentSlideData, Data } from '@/lib/types';
import MotionImage from './MotionImage';

type Props = {
  transitionData: Data;
  currentSlideData: CurrentSlideData;
};

function BackgroundImage({ transitionData, currentSlideData }: Props) {
  return (
    <>
      {transitionData && (
        <MotionImage
          fill
          sizes="100vw"
          key={transitionData.img}
          layoutId={transitionData.img}
          alt="Transition Image"
          transition={{
            opacity: { ease: 'linear' },
            layout: { duration: 0.6 },
          }}
          className=" absolute left-0 top-0 z-10 h-full w-full object-cover brightness-50"
          src={transitionData.img}
        />
      )}
      <MotionImage
        alt="Current Image"
        height={600}
        width={300}
        key={currentSlideData.data.img + 'transition'}
        src={currentSlideData.data.img}
        className=" absolute left-0 top-0 h-full w-full object-cover brightness-50"
      />
    </>
  );
}

export default BackgroundImage;
