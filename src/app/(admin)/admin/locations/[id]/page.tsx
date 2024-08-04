import DeleteIconButton from '@/app/(admin)/components/DeleteIconButton';
import FieldView from '@/app/(admin)/components/FieldView';
import HeaderDisplay from '@/app/(admin)/components/HeaderDisplay';
import { Box, Fieldset, List, ListItem, Stack } from '@mantine/core';
import { notFound } from 'next/navigation';
import { deleteLocation, getLocation } from '../actions';

type Props = {
  params: {
    id: string;
  };
};
export default async function Page({ params: { id } }: Props) {
  const item = await getLocation(id);
  if (!item) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <HeaderDisplay
        title={item.name}
        actionButtons={[<DeleteIconButton action={deleteLocation} id={id} />]}
      />

      <Stack p={'xl'}>
        <FieldView label="Name" value={item.name} />
      </Stack>
    </Box>
  );
}
