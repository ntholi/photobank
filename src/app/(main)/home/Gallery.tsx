'use client';
import { Tag } from '@prisma/client';
import { Image } from '@nextui-org/image';
import React from 'react';
import axios from 'axios';
import StackGrid from 'react-stack-grid';
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
      className="px-2"
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
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
    </section>
  );
}
