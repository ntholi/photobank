import React from 'react';
import SliderCard from './SliderCard';

type ContentData = {
  id: string;
  contentId: string;
  content: {
    id: string;
    fileName: string | null;
    s3Key: string;
    thumbnailKey: string;
    type: 'image' | 'video';
    location: {
      id: string;
      name: string;
      address: string | null;
    } | null;
  };
};

type Props = {
  data: ContentData[];
};

export default function Slides({ data }: Props) {
  return (
    <div className='flex w-full gap-6'>
      {data.map((item) => (
        <SliderCard key={item.id} data={item} />
      ))}
    </div>
  );
}
