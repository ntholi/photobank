import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { getLocation, updateLocation } from '@/server/locations/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LocationEdit({ params }: Props) {
  const { id } = await params;
  const location = await getLocation(id);
  if (!location) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <Form
        title={'Edit Location'}
        defaultValues={location}
        onSubmit={async (value) => {
          'use server';
          return await updateLocation(id, value);
        }}
      />
    </Box>
  );
}