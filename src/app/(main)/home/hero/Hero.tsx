'use client';
import { CurrentSlideData, PhotoWithData } from '@/lib/types';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import BackgroundImage from './BackgroundImage';
import Controls from './Controls';
import SlideInfo from './SlideInfo';
import Slides from './Slides';

export default function Hero({ sliderData }: { sliderData: PhotoWithData[] }) {
  const initData = sliderData[0];

  const [data, setData] = React.useState<PhotoWithData[]>(sliderData.slice(1));
  const [transitionData, setTransitionData] = React.useState<PhotoWithData>(
    sliderData[0],
  );
  const [currentSlideData, setCurrentSlideData] =
    React.useState<CurrentSlideData>({
      data: initData,
      index: 0,
    });
  const [autoPlay, setAutoPlay] = React.useState(true);

  const handleNext = React.useCallback(() => {
    setData((prev) => prev.slice(1));
    setCurrentSlideData({
      data: transitionData ? transitionData : initData,
      index: sliderData.findIndex((ele) => ele.url === data[0].url),
    });
    setTransitionData(data[0]);
    setTimeout(() => {
      setData((newData) => [
        ...newData,
        transitionData ? transitionData : initData,
      ]);
    }, 500);
  }, [data, initData, sliderData, transitionData]);

  const handleScrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        // Scrolling down
        e.preventDefault();
        handleScrollToGallery();
      }
    };

    const heroSection = document.querySelector('section');
    if (heroSection) {
      heroSection.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (heroSection) {
        heroSection.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoPlay, handleNext]);

  return (
    <section
      className={`relative min-h-screen select-none overflow-hidden text-white antialiased`}
    >
      <AnimatePresence>
        <BackgroundImage
          key='background'
          transitionData={transitionData}
          currentSlideData={currentSlideData}
        />
        <div key='content' className='absolute z-20 h-full w-full'>
          <div className='flex h-full w-full grid-cols-10 flex-col md:grid'>
            <div className='col-span-4 mb-3 flex h-full flex-1 flex-col justify-end px-5 md:mb-0 md:justify-center md:px-10'>
              <SlideInfo
                transitionData={transitionData}
                currentSlideData={currentSlideData}
              />
            </div>
            <div className='col-span-6 flex h-full flex-1 flex-col justify-start p-4 md:justify-center md:p-10'>
              <Slides data={data} />
              <Controls
                currentSlideData={currentSlideData}
                data={data}
                transitionData={transitionData}
                initData={initData}
                handleData={setData}
                handleTransitionData={setTransitionData}
                handleCurrentSlideData={setCurrentSlideData}
                sliderData={sliderData}
                handleNext={handleNext}
              />
            </div>
          </div>
        </div>
      </AnimatePresence>
    </section>
  );
}
