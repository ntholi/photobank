import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { getTag, updateTag } from '@/server/tags/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TagEdit({ params }: Props) {
  const { id } = await params;
  const tag = await getTag(id);
  if (!tag) {
    return notFound();
  }

  return (
    <Box p={{ base: 'sm', md: 'lg' }}>
      <Form
        title={'Edit Tag'}
        defaultValues={tag}
        onSubmit={async (value) => {
          'use server';
          return await updateTag(id, value);
        }}
      />
    </Box>
  );
}
