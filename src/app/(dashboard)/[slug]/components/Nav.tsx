import Image from 'next/image';
import Link from 'next/link';

type Props = {
  username: string;
};

export default function ProfileNav({ username }: Props) {
  return (
    <nav className='border-e h-screen w-1/4'>
      <div className='flex justify-center p-8'>
        <Image alt='logo' src='/images/logo.jpg' width={100} height={100} />
      </div>
      <ul>
        <li>
          <Link href={`${username}`}>Profile</Link>
        </li>
      </ul>
    </nav>
  );
}
