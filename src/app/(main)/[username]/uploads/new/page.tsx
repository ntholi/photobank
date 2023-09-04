import { Image } from '@nextui-org/image';
import ModalButton from './ModalButton';

type UploadURL = {
  uploadURL: string;
  id: string;
};

const getUploadUrl = async () => {
  const token = process.env.CLOUDFLARE_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  const results = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await results.json();

  if (!data.success) {
    //TODO: handle this error properly
    throw new Error(data.errors[0].message);
  }
  return data.result as UploadURL;
};

export default async function UploadPage() {
  const uploadUrl = await getUploadUrl();

  console.log('uploadUrl', uploadUrl);

  return (
    <>
      <section className="flex flex-col justify-center items-center w-full h-screen">
        <Image
          src="/images/photo_session.svg"
          alt="photo upload "
          width={400}
        />
        <h1 className="text-2xl font-semibold text-gray-700 mt-8">
          Upload Your Photo
        </h1>
        <p className="text-sm text-gray-500 sm:w-96 text-center my-4">
          Please note that only photos related to Lesotho bla-bla will be
          accepted, all photos are subject to review before they can be
          published on the photo bank
        </p>
        <ModalButton uploadUrl={uploadUrl} />
      </section>
    </>
  );
}
