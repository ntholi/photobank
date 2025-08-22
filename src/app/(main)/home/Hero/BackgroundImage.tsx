import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/utils';

type ContentData = {
  id: string;
  contentId: string;
  content: {
    id: string;
    fileName: string | null;
    thumbnailKey: string;
    type: 'image' | 'video';
  };
};

type Props = {
  transitionData: ContentData | null;
  currentSlideData: ContentData | null;
};

export default function BackgroundImage({
  transitionData,
  currentSlideData,
}: Props) {
  const transitionUrl = transitionData
    ? getImageUrl(transitionData.content.thumbnailKey)
    : '';
  const currentUrl = currentSlideData
    ? getImageUrl(currentSlideData.content.thumbnailKey)
    : '';

  return (
    <>
      {transitionData && transitionUrl && (
        <motion.img
          key={transitionData.content.thumbnailKey}
          layoutId={transitionData.content.thumbnailKey}
          alt='Transition Image'
          transition={{
            opacity: { ease: 'linear' },
            layout: { duration: 0.6 },
          }}
          className='absolute left-0 top-0 z-10 h-full w-full object-cover brightness-50'
          src={transitionUrl}
        />
      )}
      {currentSlideData && currentUrl && (
        <motion.img
          alt='Current Image'
          key={currentSlideData.content.thumbnailKey + 'transition'}
          src={currentUrl}
          className='absolute left-0 top-0 h-full w-full object-cover brightness-50'
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/photo_session.svg';
          }}
        />
      )}
    </>
  );
}
