import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Progress from './Progress';

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
    <button
      className='flex h-14 w-14 items-center justify-center rounded-full border-[1px] border-[#fdfdfd5f] transition duration-300 ease-in-out hover:bg-white hover:text-black'
      onClick={onClick}
    >
      {children}
    </button>
  );
};
