import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { Prisma } from '@prisma/client';
import { getUser, updateUser } from '../../actions';

type User = Prisma.UserCreateInput;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserEdit({ params }: Props) {
  const { id } = await params;
  const users = await getUser(Number(id));
  if (!users) {
    return notFound();
  }

  const handleSubmit = async (values: User): Promise<User> => {
    'use server'
    await updateUser(id, values);
    return values;
  };

  return (
    <Box p={'lg'}>
      <Form
        defaultValues={users}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}