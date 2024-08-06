'use client';
import { thumbnail } from '@/lib/config/urls';
import { shorten } from '@/lib/utils';
import { Image, Spinner } from '@nextui-org/react';
import { Location, Photo, Tag } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Container from '../../base/Container';
import FilterBar from '../../home/FilterBar';

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
        .post('/api/photos/search', { locationId: location.id, tagId: tag?.id })
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
        <section className="grid cursor-pointer grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {photos?.map((it) => (
            <article key={it.id} className="hover:shadow-sm rounded-xl pb-2">
              <Image
                src={thumbnail(it.fileName)}
                alt={it.caption || 'Lehakoe'}
                onClick={() => router.push(`/photos/${it.id}`)}
              />
              <p className="text-gray-800 mt-3 px-2 font-light">
                {shorten(it.caption, 80)}
              </p>
            </article>
          ))}
        </section>
      )}
    </Container>
  );
}
