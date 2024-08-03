import DeleteIconButton from '@/app/(admin)/components/DeleteIconButton';
import FieldView from '@/app/(admin)/components/FieldView';
import HeaderDisplay from '@/app/(admin)/components/HeaderDisplay';
import { Box, Stack } from '@mantine/core';
import { notFound } from 'next/navigation';
import { deletePhoto, getPhoto } from '../actions';

type Props = {
  params: {
    id: string;
  };
};
export default async function Page({ params: { id } }: Props) {
  const item = await getPhoto(id);
  if (!item) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <HeaderDisplay
        title={item.id}
        actionButtons={[<DeleteIconButton action={deletePhoto} id={id} />]}
      />

      <Stack p={'xl'}>
        <FieldView label="ID" value={item.id} />
        <FieldView label="File Name" value={item.fileName} />
      </Stack>
    </Box>
  );
}
