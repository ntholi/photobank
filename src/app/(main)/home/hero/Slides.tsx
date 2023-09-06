import React from 'react';
import SliderCard from './SliderCard';
import { PhotoWithData } from '@/lib/types';

type Props = {
  data: PhotoWithData[];
};

function Slides({ data }: Props) {
  return (
    <div className=" flex w-full gap-6">
      {data.map((data) => {
        return <SliderCard key={data.url} data={data} />;
      })}
    </div>
  );
}

export default Slides;
