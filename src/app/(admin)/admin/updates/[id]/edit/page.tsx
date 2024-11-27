import { Box } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { getUpdate, updateUpdate } from '../../actions';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPage(props: Props) {
  const params = await props.params;
  const { id } = params;

  const item = await getUpdate(Number(id));
  if (!item) return notFound();

  return (
    <Box p={'lg'}>
      <Form
        value={item}
        onSubmit={async (value) => {
          'use server';
          const res = await updateUpdate(Number(id), value);
          revalidatePath(`/admin/updates/${res.id}`);
          return res;
        }}
      />
    </Box>
  );
}
