import Image from 'next/image';

export default function ProfileNav() {
  return (
    <nav className='border-e h-screen w-1/4'>
      <div className='flex justify-center'>
        <Image alt='logo' src='/images/logo.jpg' width={100} height={100} />
      </div>
    </nav>
  );
}
