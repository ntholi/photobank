'use client';
import { Tag } from '@prisma/client';
import { Image } from '@nextui-org/image';
import React from 'react';
import axios from 'axios';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { PhotoWithData } from '@/lib/types';
import { useRouter } from 'next/navigation';

type Props = {
  searchKey: string;
  tag: Tag | null;
};

export default function Gallery({ searchKey, tag }: Props) {
  const [photos, setPhotos] = React.useState<PhotoWithData[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    axios.post(`/api/photos/search?searchKey=${searchKey}`, tag).then((res) => {
      setPhotos(res.data.photos);
    });
  }, [searchKey, tag]);

  return (
    <section
      className="container mx-auto px-4"
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
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
