import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import {
  getLocationWithCoverContent,
  updateLocation,
} from '@/server/locations/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LocationEdit({ params }: Props) {
  const { id } = await params;
  const locationData = await getLocationWithCoverContent(id);
  if (!locationData) {
    return notFound();
  }

  const { coverContent, about, ...location } = locationData;

  return (
    <Box p={{ base: 'sm', md: 'lg' }}>
      <Form
        title={'Edit Location'}
        defaultValues={location}
        defaultCoverContent={coverContent}
        defaultAbout={about || undefined}
        onSubmit={async (value) => {
          'use server';
          return await updateLocation(id, value);
        }}
      />
    </Box>
  );
}
