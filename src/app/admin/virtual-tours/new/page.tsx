import { Box } from '@mantine/core';
import Form from '../Form';
import {
  updateLocationDetail,
  getLocationDetail,
} from '../../location-details/actions';

export default function NewPage() {
  const handleSubmit = async (values: {
    locationDetailsId: string;
    tourUrl: string;
  }) => {
    'use server';
    const locationDetails = await getLocationDetail(values.locationDetailsId);
    if (!locationDetails) throw new Error('Location not found');

    return await updateLocationDetail(values.locationDetailsId, {
      ...locationDetails,
      tourUrl: values.tourUrl,
    });
  };

  return (
    <Box p={'lg'}>
      <Form title={'Add Virtual Tour'} onSubmit={handleSubmit} />
    </Box>
  );
}
