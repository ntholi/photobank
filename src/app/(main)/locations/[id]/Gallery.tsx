'use client';
import { Image, Spinner } from '@nextui-org/react';
import { Location, Photo, Tag } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Container from '../../base/Container';
import FilterBar from '../../home/FilterBar';
import { thumbnail } from '@/lib/config/urls';
import axios from 'axios';

type Props = {
  location: Location;
};
export default function Gallery({ location }: Props) {
  const router = useRouter();
  const [tag, setTag] = React.useState<Tag | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      axios
        .post('/api/photos/search', { locationId: location.id })
        .then((res) => {
          setPhotos(res.data);
        })
        .then(() => setLoading(false));
    };
    fetchData();
  }, [tag]);

  return (
    <Container width="xl">
      <div className="p-4 flex">
        <FilterBar setSelected={setTag} selected={tag} />
      </div>
      {loading ? (
        <div className="flex justify-center pt-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3, 1700: 4 }}
        >
          <Masonry gutter={'1rem'}>
            {photos?.map((it) => (
              <Image
                key={it.id}
                src={thumbnail(it.fileName)}
                alt={it.caption || 'Lehakoe'}
                width={600}
                height={600}
                className="cursor-pointer"
                onClick={() => router.push(`/photos/${it.id}`)}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </Container>
  );
}
