import { Image } from '@nextui-org/image';
import ModalButton from './ModalButton';

export default async function UploadPage() {
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
        <ModalButton />
      </section>
    </>
  );
}
