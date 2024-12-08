import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import {
  getLocationDetail,
  updateLocationDetail,
} from '../../../location-details/actions';
import Form from '../../Form';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function VirtualTourEdit({ params }: Props) {
  const { id } = await params;
  const locationDetails = await getLocationDetail(id);

  if (!locationDetails) {
    return notFound();
  }

  const handleSubmit = async (values: {
    locationDetailsId: string;
    tourUrl: string;
  }) => {
    'use server';
    return await updateLocationDetail(id, {
      ...locationDetails,
      tourUrl: values.tourUrl,
    });
  };

  return (
    <Box p={'lg'}>
      <Form
        title={'Edit Virtual Tour'}
        defaultValues={{
          locationDetailsId: locationDetails.id,
          tourUrl: locationDetails.tourUrl || '',
          locationName: locationDetails.location.name,
        }}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
