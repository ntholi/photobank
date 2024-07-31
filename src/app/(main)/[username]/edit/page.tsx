import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Form from './Form';
import { auth } from '@/auth';

const getUser = async (username?: string) => {
  return prisma.user.findUnique({
    where: {
      username: username,
    },
  });
};

export default async function EditPage() {
  const session = await auth();
  const user = await getUser(session?.user?.username);

  if (!user) {
    return notFound();
  }

  return (
    <div className=" md:p-10">
      <h1 className="text-xl max-md:mt-10">Edit Profile</h1>
      <Form user={user} />
    </div>
  );
}
