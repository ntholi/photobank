import { Box } from '@mantine/core';
import Form from '../Form';
import { createUser } from '../actions';
import { Prisma } from '@prisma/client';

type User = Prisma.UserCreateInput;

export default async function NewPage() {
  const handleSubmit = async (values: User): Promise<User> => {
    await createUser(values);
    return values;
  };

  return (
    <Box p={'lg'}>
      <Form onSubmit={handleSubmit} />
    </Box>
  );
}
