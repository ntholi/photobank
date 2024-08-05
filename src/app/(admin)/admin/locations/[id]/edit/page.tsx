import { Box } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { getLocation, updateLocationDetails } from '../../actions';

type Props = {
  params: {
    id: string;
  };
};

export default async function EditPage({ params: { id } }: Props) {
  const item = await getLocation(id);
  if (!item) return notFound();

  return (
    <Box p={'lg'}>
      <Form
        value={item}
        onSubmit={async (value) => {
          'use server';
          const res = await updateLocationDetails(id, value, value.location!);
          revalidatePath(`/admin/locations/${res.id}`);
          return res;
        }}
      />
    </Box>
  );
}
