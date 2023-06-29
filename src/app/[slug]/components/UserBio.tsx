import ProfilePicture from './ProfilePicture';
import Image from 'next/image';

export default function UserBio() {
  return (
    <div className='flex flex-col w-2/4 mx-auto mt-14 border border-blue-300'>
      <Image
        src='/images/profile.png'
        height={150}
        width={150}
        className='rounded-full border border-zinc-400'
        alt='Profile Picture'
      />
    </div>
  );
}
