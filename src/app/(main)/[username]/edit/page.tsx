import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import Form from './Form';

const getUser = async (username?: string) => {
  return prisma.user.findUnique({
    where: {
      username: username,
    },
  });
};

export default async function EditPage() {
  const session = await getServerSession(authOptions);
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
