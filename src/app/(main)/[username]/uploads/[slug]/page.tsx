'use client';
import { Image } from '@nextui-org/image';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/lib/config/firebase';
import { constants } from '@/lib/constants';
import PhotoUploadForm from './PhotoUploadForm';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Props = { params: { slug: string } };

export default function Page({ params }: Props) {
  const [photoUrl, setPhotoUrl] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [loadingLabels, setLoadingLabels] = useState(false);

  useEffect(() => {
    const sRef = ref(storage, `${constants.UPLOAD_FOLDER}/${params.slug}`);
    getDownloadURL(sRef).then((url) => {
      setPhotoUrl(url);
    });
  }, [params]);

  useEffect(() => {
    setLoadingLabels(true);
    axios
      .get(`/api/photos/generate-labels?photoUrl=${photoUrl}`)
      .then((res) => {
        console.log(res.data);
        console.log(photoUrl);
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
        <PhotoUploadForm photoUrl={photoUrl} photoLabels={labels} />
      </div>
    </section>
  );
}
