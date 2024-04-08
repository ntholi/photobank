'use client';
import { Tag } from '@prisma/client';
import { Image } from '@nextui-org/react';
import React from 'react';
import { PhotoWithData } from '@/lib/types';
import { useRouter } from 'next/navigation';
import FilterBar from '../../home/FilterBar';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

type Props = {
  photos: PhotoWithData[];
};

export default function Gallery({ photos }: Props) {
  const router = useRouter();
  const [tag, setTag] = React.useState<Tag | null>(null);

  return (
    <section className="container mx-auto px-4">
      <div className="p-4 flex justify-center">
        <FilterBar setSelected={setTag} selected={tag} />
      </div>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3, 1700: 4 }}
      >
        <Masonry gutter={'1rem'}>
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
        </Masonry>
      </ResponsiveMasonry>
    </section>
  );
}
