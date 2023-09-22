'use client';
import { CurrentSlideData, PhotoWithData } from '@/lib/types';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import SlideInfo from './SlideInfo';
import Slides from './Slides';
import Controls from './Controls';
import BackgroundImage from './BackgroundImage';

export default function Home({ sliderData }: { sliderData: PhotoWithData[] }) {
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

  return (
    <section
      className={`
        relative min-h-screen select-none overflow-hidden text-white antialiased`}
    >
      <AnimatePresence>
        <BackgroundImage
          transitionData={transitionData}
          currentSlideData={currentSlideData}
        />
        <div className="absolute z-20  h-full w-full">
          <div className="flex h-full w-full grid-cols-10 flex-col md:grid">
            <div className="col-span-4 mb-3 flex h-full flex-1 flex-col justify-end px-5 md:mb-0 md:justify-center md:px-10">
              <SlideInfo
                transitionData={transitionData}
                currentSlideData={currentSlideData}
              />
            </div>
            <div className="col-span-6 flex h-full flex-1 flex-col justify-start p-4 md:justify-center md:p-10">
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
              />
            </div>
          </div>
        </div>
      </AnimatePresence>
    </section>
  );
}
