import React from 'react';
import SliderCard from './SliderCard';
import { PhotoWithUser } from '@/lib/types';

type Props = {
  data: PhotoWithUser[];
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
