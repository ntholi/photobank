import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/db';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { User } from '@nextui-org/user';
import { getServerSession } from 'next-auth';
import React from 'react';

const getUser = async (username?: string) => {
  const user = prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return user;
};

export default async function EditPage() {
  const session = await getServerSession(authOptions);
  const user = await getUser(session?.user?.username);
  return (
    <div className=" md:p-10">
      <h1 className="text-xl">Edit Profile</h1>
      <div className="md:m-8 space-y-3 md:w-[45vw]">
        <User
          name={user?.firstName + ' ' + user?.lastName}
          description={
            <Link href="#" size="sm" isExternal>
              Change Profile Picture
            </Link>
          }
          avatarProps={{
            src: user?.image || undefined,
            size: 'lg',
          }}
        />

        <Input
          type="text"
          variant="bordered"
          label="First Name"
          value={user?.firstName || ''}
        />
        <Input
          type="text"
          variant="bordered"
          label="Last Name"
          value={user?.lastName || ''}
        />
        <Textarea
          type="text"
          variant="bordered"
          label="Bio"
          value={user?.bio || ''}
        />
        <Button className="w-full md:w-60" color="primary">
          Save
        </Button>
      </div>
    </div>
  );
}
