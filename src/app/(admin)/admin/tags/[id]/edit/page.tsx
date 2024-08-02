import { Box } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { getTag, updateTag } from '../../actions';

type Props = {
  params: {
    id: string;
  };
};

export default async function EditPage({ params: { id } }: Props) {
  const item = await getTag(Number(id));
  if (!item) return notFound();

  return (
    <Box p={'lg'}>
      <Form
        value={item}
        onSubmit={async (value) => {
          'use server';
          const { labels, ...data } = value;
          const res = await updateTag(Number(id), value);
          revalidatePath(`/admin/tags/${res.id}`);
          return res;
        }}
      />
    </Box>
  );
}
