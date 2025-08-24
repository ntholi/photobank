'use client';

import { getAllHomeContentWithDetails } from '@/server/home-contet/actions';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@heroui/button';
import { IconChevronDown } from '@tabler/icons-react';
import BackgroundImage from './BackgroundImage';
import Slides from './Slides';
import SlideInfo from './SlideInfo';
import Controls from './Controls';
import HomeNavbar from '../../base/HomeNavbar';

type HomeContentData = {
  id: string;
  position: number;
  contentId: string;
  createdAt: Date;
  content: {
    id: string;
    fileName: string | null;
    description: string | null;
    s3Key: string;
    thumbnailKey: string;
    watermarkedKey: string | null;
    type: 'image' | 'video';
    status: string;
    locationId: string | null;
    user: {
      id: string;
      name: string | null;
    } | null;
    location: {
      id: string;
      name: string;
      address: string | null;
    } | null;
  };
};

type ContentData = {
  id: string;
  contentId: string;
  content: {
    id: string;
    fileName: string | null;
    description: string | null;
    s3Key: string;
    thumbnailKey: string;
    type: 'image' | 'video';
    user: {
      id: string;
      name: string | null;
    } | null;
    location: {
      id: string;
      name: string;
      address: string | null;
    } | null;
  };
};

type Props = {
  content: HomeContentData[];
};

export default function Hero({ content }: Props) {
  // Transform the content data to match our ContentData type
  const transformContent = (item: HomeContentData): ContentData => ({
    id: item.id,
    contentId: item.contentId,
    content: {
      id: item.content.id,
      fileName: item.content.fileName,
      description: item.content.description,
      s3Key: item.content.s3Key,
      thumbnailKey: item.content.thumbnailKey,
      type: item.content.type,
      user: item.content.user,
      location: item.content.location,
    },
  });

  const transformedContent = content.map(transformContent);

  const [data, setData] = React.useState<ContentData[]>(
    transformedContent.slice(1)
  );
  const [transitionData, setTransitionData] =
    React.useState<ContentData | null>(transformedContent[0] || null);
  const [currentSlideData, setCurrentSlideData] =
    React.useState<ContentData | null>(transformedContent[0] || null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const handleScrollToGallery = () => {
    const el = document.getElementById('gallery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  React.useEffect(() => {
    if (transformedContent.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [transformedContent.length, isPaused, currentIndex]);

  const handlePrev = () => {
    if (!transitionData && !currentSlideData) return;
    setData((prevData) => [
      transitionData || currentSlideData!,
      ...prevData.slice(0, prevData.length - 1),
    ]);
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      return newIndex < 0 ? transformedContent.length - 1 : newIndex;
    });
    setTransitionData(data[data.length - 1]);
  };

  const handleNext = () => {
    if (!transitionData && !currentSlideData) return;
    setData((prev) => prev.slice(1));
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      return newIndex >= transformedContent.length ? 0 : newIndex;
    });
    setTransitionData(data[0]);
    setTimeout(() => {
      setData((newData) => [...newData, transitionData || currentSlideData!]);
    }, 500);
  };

  if (transformedContent.length === 0) {
    return (
      <div className='relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center'>
        <div className='text-center text-white'>
          <h1 className='text-4xl font-bold mb-4'>Welcome to Lehakoe</h1>
          <p className='text-xl opacity-80'>
            Discover the beauty of Lesotho through our curated collection
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      className='relative min-h-screen select-none overflow-hidden text-white antialiased'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence>
        <BackgroundImage
          key='background'
          transitionData={transitionData}
          currentSlideData={currentSlideData}
        />
      </AnimatePresence>
      <div className='absolute z-20 h-full w-full'>
        {/* Navbar */}
        <HomeNavbar />

        <div className='flex h-full w-full grid-cols-10 flex-col md:grid'>
          <div className='col-span-4 mb-3 flex h-full flex-1 flex-col justify-end px-5 md:mb-0 md:justify-center md:px-10'>
            <SlideInfo data={transitionData || currentSlideData} />
          </div>
          <div className='col-span-6 flex h-full flex-1 flex-col justify-start p-4 md:justify-center md:p-10'>
            <Slides data={data} />
            <Controls
              currentIndex={currentIndex}
              data={transformedContent}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        </div>
        <div className='absolute bottom-6 left-0 right-0 z-30 flex w-full justify-center'>
          <Button
            radius='full'
            variant='light'
            size='lg'
            isIconOnly
            onPress={handleScrollToGallery}
            aria-label='Scroll to gallery'
          >
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.6,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            >
              <IconChevronDown className='text-gray-50' size={22} />
            </motion.span>
          </Button>
        </div>
      </div>
    </main>
  );
}
