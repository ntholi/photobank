import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Progress from './Progress';
import { Button } from '@heroui/button';

type ContentData = {
  id: string;
  contentId: string;
  content: {
    id: string;
    fileName: string | null;
    s3Key: string;
    thumbnailKey: string;
    type: 'image' | 'video';
  };
};

type Props = {
  currentIndex: number;
  data: ContentData[];
  onPrev: () => void;
  onNext: () => void;
};

export default function Controls({
  currentIndex,
  data,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className='flex items-center gap-3 px-0 py-3 md:px-1 md:py-5'>
      <SliderButton onClick={onPrev}>
        <IoIosArrowBack className='text-xl' />
      </SliderButton>
      <SliderButton onClick={onNext}>
        <IoIosArrowForward className='text-xl' />
      </SliderButton>
      <Progress curIndex={currentIndex} length={data.length} />
    </div>
  );
}

const SliderButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <Button
      isIconOnly
      variant='light'
      radius='full'
      onPress={onClick}
      className='border-1 text-gray-300/90 border-gray-300/90 hover:text-black'
    >
      {children}
    </Button>
  );
};
