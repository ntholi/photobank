'use client';
import { Image } from '@nextui-org/image';
import PhotoUploadForm from './Form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

type Props = { params: { photoId: string } };

export default function Page({ params: { photoId } }: Props) {
  const searchParams = useSearchParams();
  const [labels, setLabels] = useState<string[]>([]);
  const [loadingLabels, setLoadingLabels] = useState(false);
  const photoUrl = searchParams.get('photoUrl') || '';

  useEffect(() => {
    setLoadingLabels(true);
    axios
      .get(
        `/api/photos/generate-labels?photoUrl=${encodeURIComponent(photoUrl)}`,
      )
      .then((res) => {
        setLabels(res.data.labels);
      })
      .finally(() => {
        setLoadingLabels(false);
      });
  }, [photoUrl]);

  return (
    <section className="px-16 pt-5 lg:grid grid-cols-11 space-y-5 gap-5">
      <div className={'col-span-5'}>
        <Image
          src={photoUrl}
          alt={'Uploaded Image'}
          shadow="sm"
          isLoading={loadingLabels}
        />
      </div>
      <div className={'rounded-xl col-span-6'}>
        <PhotoUploadForm
          photoId={photoId}
          photoLabels={labels}
          disabled={loadingLabels}
        />
      </div>
    </section>
  );
}
