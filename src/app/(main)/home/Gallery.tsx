'use client';
import { PhotoWithData } from '@/lib/types';
import { Image, Skeleton } from '@nextui-org/react';
import { Tag } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

type Props = {
  searchKey: string;
  tag: Tag | null;
};

export default function Gallery({ searchKey, tag }: Props) {
  const [photos, setPhotos] = React.useState<PhotoWithData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setPhotos([]);
      try {
        const { data } = await axios.post(
          `/api/photos/search?searchKey=${searchKey}`,
          { tagId: tag?.id },
        );
        if (data.length > 0) {
          setPhotos(data as PhotoWithData[]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [searchKey, tag]);

  return (
    <section
      className="container mx-auto px-4"
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from(Array(3).keys()).map((i) => (
            <Skeleton key={i} className="rounded-lg">
              <div className="h-60 sm:h-72 rounded-lg bg-default-300"></div>
            </Skeleton>
          ))}
        </div>
      ) : (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3, 1700: 4 }}
        >
          <Masonry gutter={'1rem'}>
            {photos.map((it) => (
              <Image
                key={it.id}
                src={it.url}
                alt={it.caption || 'Lehakoe'}
                className="cursor-pointer"
                onClick={() => router.push(`/photos/${it.id}`)}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </section>
  );
}
