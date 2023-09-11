'use client';
import { Photo, Tag } from '@prisma/client';
import { Image } from '@nextui-org/image';
import React from 'react';
import axios from 'axios';
import StackGrid from 'react-stack-grid';
import { PhotoWithData } from '@/lib/types';
import { useRouter } from 'next/navigation';
import FilterBar from '../../home/FilterBar';

type Props = {
  photos: PhotoWithData[];
};

export default function Gallery({ photos }: Props) {
  const router = useRouter();
  const [tag, setTag] = React.useState<Tag | null>(null);

  return (
    <>
      <div className="p-4 flex justify-center">
        <FilterBar setSelected={setTag} selected={tag} />
      </div>
      <StackGrid columnWidth={380} monitorImagesLoaded={true}>
        {photos.map((it) => (
          <Image
            key={it.id}
            src={it.url}
            alt={it.caption || 'Lesotho'}
            width={600}
            height={600}
            className="cursor-pointer"
            onClick={() => router.push(`/photos/${it.id}`)}
          />
        ))}
      </StackGrid>
    </>
  );
}
