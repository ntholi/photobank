import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { getContent, updateContent } from '@/server/content/actions';
import { getLocation } from '@/server/locations/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContentEdit({ params }: Props) {
  const { id } = await params;
  const content = await getContent(id);
  if (!content) {
    return notFound();
  }
  const location = content.locationId
    ? await getLocation(content.locationId)
    : null;

  return (
    <Box p={'lg'}>
      <Form
        title={'Edit Content'}
        defaultValues={content}
        initialLocationName={location?.name ?? undefined}
        onSubmit={async (value) => {
          'use server';
          return await updateContent(id, value);
        }}
      />
    </Box>
  );
}
