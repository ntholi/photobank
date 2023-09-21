'use client';
import { profilePath } from '@/lib/constants';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';
import { Role, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BiSolidBadgeCheck } from 'react-icons/bi';
import WebsiteLink from './WebsiteLink';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover';

type Props = {
  user: User;
};

export default function UserBio({ user }: Props) {
  const { data: session } = useSession();

  return (
    <>
      <div className="flex mt-8">
        <Image
          width={250}
          height={250}
          referrerPolicy="no-referrer"
          src={largeSize(user.image) || '/images/profile.png'}
          className="rounded-full border border-zinc-400 w-28 h-28 sm:w-40 sm:h-40"
          alt="Profile Picture"
        />
        <div className="ml-5 sm:ml-16 mt-2 sm:mt-3">
          <div className="flex flex-col md:flex-row gap-4 items-baseline">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-600">
                {`${user.firstName} ${user.lastName}`}
              </h1>
              {hasCheckMark(user) && (
                <Popover placement="right">
                  <PopoverTrigger>
                    <span
                      color="primary"
                      className={`cursor-pointer ${
                        user.role === 'contributor'
                          ? 'text-blue-500'
                          : 'text-yellow-500'
                      }`}
                    >
                      <BiSolidBadgeCheck size="1.2rem" />
                    </span>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2 text-tiny">
                      {checkMarkDescription(user.role)}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {session?.user?.id === user.id && (
              <Button
                size="sm"
                radius="sm"
                variant="flat"
                as={Link}
                href={`${profilePath(user)}/edit`}
              >
                Edit Profile
              </Button>
            )}
          </div>
          <div className="hidden md:block w-48 md:w-96 text-sm mt-3 text-foreground-500">
            <p>{user.bio}</p>
            <WebsiteLink user={user} />
          </div>
        </div>
      </div>
      <div className="block md:hidden text-sm mt-3 text-foreground-500">
        <p>{user.bio}</p>
        <WebsiteLink user={user} />
      </div>
    </>
  );
}

function checkMarkDescription(role: Role) {
  if (role === 'admin') {
    return 'User is an Admin';
  } else if (role == 'moderator') {
    return 'User can moderate content on this platform';
  } else if (role == 'contributor') {
    return 'User is a Contributor';
  }
}

function hasCheckMark(user: User) {
  const checkedRoles = ['admin', 'moderator', 'contributor'];
  if (checkedRoles.includes(user.role)) {
    return true;
  }
  return false;
}

const largeSize = (photoURL?: string | null) => {
  if (!photoURL) return null;
  if (photoURL.includes('googleusercontent')) {
    return photoURL.replace('s96-c', 's400-c');
  }
  return photoURL;
};

export const nameToInitials = (name?: string | null) => {
  if (!name) return '?';
  const initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
};
