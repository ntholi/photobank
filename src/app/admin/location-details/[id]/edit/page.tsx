import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { Prisma } from '@prisma/client';
import { getLocationDetail, updateLocationDetail } from '../../actions';

type LocationDetail = Prisma.LocationDetailsCreateInput;

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
    values: LocationDetail,
  ): Promise<LocationDetail> => {
    'use server';
    await updateLocationDetail(id, values);
    return values;
  };

  return (
    <Box p={'lg'}>
      <Form
        title={'Edit LocationDetail'}
        defaultValues={locationDetails}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
