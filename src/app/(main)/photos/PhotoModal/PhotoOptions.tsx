import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Photo } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { e } from 'nuqs/dist/serializer-C_l8WgvO';
import React from 'react';
import { SlOptions } from 'react-icons/sl';

type Props = {
  photo: Photo;
};

type MenuItem = {
  label: string;
  href?: string;
};

export default function PhotoOptions({ photo }: Props) {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === photo.userId;

  const MenuItems: MenuItem[] = [
    {
      label: 'Go to Photo',
      href: `/photos/${photo.id}`,
    },
  ];

  if (isOwner) {
    MenuItems.push({
      label: 'Edit Photo',
      href: `${photo.userId}/uploads/${photo.id}`,
    });
    MenuItems.push({
      label: 'Delete Photo',
    });
  } else {
    MenuItems.push({
      label: 'Report Photo',
      href: `/photos/${photo.id}/report`,
    });
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size='sm' aria-label='Options' variant='light'>
          <SlOptions className='text-base' />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions'>
        {MenuItems.map((it) => (
          <DropdownItem
            key={it.label}
            as={it.href ? Link : undefined}
            href={it.href}
          >
            {it.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
