import { Box } from '@mantine/core';
import { LocationDetails } from '@prisma/client';
import { notFound } from 'next/navigation';
import { getLocationDetail, updateLocationDetail } from '../../actions';
import Form from '../../Form';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LocationDetailEdit({ params }: Props) {
  const { id } = await params;
  const locationDetails = await getLocationDetail(id);
  if (!locationDetails) {
    return notFound();
  }

  const handleSubmit = async (
    values: LocationDetails,
  ): Promise<LocationDetails> => {
    'use server';
    await updateLocationDetail(id, values);
    return values;
  };

  return (
    <Box p={'lg'}>
      <Form
        title={'Edit Location'}
        defaultValues={locationDetails}
        onSubmit={handleSubmit as any}
      />
    </Box>
  );
}
