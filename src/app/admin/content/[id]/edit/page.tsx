import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { getContent, updateContent } from '@/server/content/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContentEdit({ params }: Props) {
  const { id } = await params;
  const content = await getContent(id);
  if (!content) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <Form
        title={'Edit Content'}
        defaultValues={content}
        onSubmit={async (value) => {
          'use server';
          return await updateContent(id, value);
        }}
      />
    </Box>
  );
}
