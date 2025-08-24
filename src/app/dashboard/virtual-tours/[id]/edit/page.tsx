import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { getVirtualTour, updateVirtualTour } from '@/server/virtual-tours/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function VirtualTourEdit({ params }: Props) {
  const { id } = await params;
  const virtualTour = await getVirtualTour(id);
  if (!virtualTour) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <Form
        title={'Edit Virtual Tour'}
        defaultValues={virtualTour}
        onSubmit={async (value) => {
          'use server';
          return await updateVirtualTour(id, value);
        }}
      />
    </Box>
  );
}