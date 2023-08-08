'use client';
import Link from 'next/link';
import Image from 'next/image';
import { AiFillCaretDown } from 'react-icons/ai';
import { usePathname } from 'next/navigation';

function Header() {
  const pathname = usePathname();

  const position = pathname === '/' ? 'fixed' : 'static';

  return (
    <nav
      className={`${position} z-50 flex w-screen justify-between gap-x-6 border-b border-b-stone-800 bg-black/10 px-6 py-4 text-white backdrop-blur-sm`}
    >
      <div className="flex">Navbar</div>
    </nav>
  );
}
export default Header;
