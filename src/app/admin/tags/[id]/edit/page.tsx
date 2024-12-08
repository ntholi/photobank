import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { Tag } from '@prisma/client';
import { getTag, updateTag } from '../../actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TagEdit({ params }: Props) {
  const { id } = await params;
  const tags = await getTag(Number(id));
  if (!tags) {
    return notFound();
  }

  const handleSubmit = async (values: Tag): Promise<Tag> => {
    'use server';
    await updateTag(Number(id), values);
    return values;
  };

  return (
    <Box p={'lg'}>
      <Form title={'Edit Tag'} defaultValues={tags} onSubmit={handleSubmit} />
    </Box>
  );
}
