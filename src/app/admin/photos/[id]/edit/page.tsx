import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { Prisma } from '@prisma/client';
import { getPhoto, updatePhoto } from '../../actions';

type Photo = Prisma.PhotoCreateInput;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PhotoEdit({ params }: Props) {
  const { id } = await params;
  const photos = await getPhoto(id);
  if (!photos) {
    return notFound();
  }

  const handleSubmit = async (values: Photo): Promise<Photo> => {
    'use server';
    await updatePhoto(id, values);
    return values;
  };

  return (
    <Box p={'lg'}>
      <Form
        title={'Edit Photo'}
        defaultValues={photos}
        onSubmit={handleSubmit as any}
      />
    </Box>
  );
}
