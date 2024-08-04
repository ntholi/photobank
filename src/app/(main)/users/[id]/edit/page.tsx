import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Form from './Form';
import { auth } from '@/auth';

const getUser = async (id?: string) => {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};

export default async function EditPage() {
  const session = await auth();
  const user = await getUser(session?.user?.id);

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
