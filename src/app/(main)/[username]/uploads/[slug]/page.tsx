import { Image } from '@nextui-org/image';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/lib/config/firebase';
import { constants } from '@/lib/constants';
import PhotoUploadForm from './PhotoUploadForm';

type Props = { params: { slug: string } };

export default async function Page({ params }: Props) {
  const photoUrl = await getDownloadURL(
    ref(storage, `${constants.UPLOAD_FOLDER}/${params.slug}`),
  );

  return (
    <section className="px-16 pt-5 lg:grid grid-cols-5 space-y-5 gap-5">
      <div className={'col-span-2'}>
        <Image src={photoUrl} alt={'Uploaded Image'} />
      </div>
      <div className={'rounded-xl col-span-3'}>
        <PhotoUploadForm photoUrl={photoUrl} />
      </div>
    </section>
  );
}
