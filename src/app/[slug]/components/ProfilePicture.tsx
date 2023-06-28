import Image from 'next/image';

export default function ProfilePicture() {
  return (
    <>
      <Image
        src='/images/profile.png'
        height={150}
        width={150}
        className='rounded-full border border-zinc-400'
        alt='Profile Picture'
      />
    </>
  );
}
