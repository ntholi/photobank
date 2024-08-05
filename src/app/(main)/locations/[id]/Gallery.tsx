'use client';
import { PhotoWithData } from '@/lib/types';
import { Image } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Container from '../../base/Container';

type Props = {
  photos: PhotoWithData[];
};

export default function Gallery({ photos }: Props) {
  const router = useRouter();

  return (
    <Container width="xl">
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3, 1700: 4 }}
      >
        <Masonry gutter={'1rem'}>
          {photos.map((it) => (
            <Image
              key={it.id}
              src={it.url}
              alt={it.caption || 'Lehakoe'}
              width={600}
              height={600}
              className="cursor-pointer"
              onClick={() => router.push(`/photos/${it.id}`)}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </Container>
  );
}
