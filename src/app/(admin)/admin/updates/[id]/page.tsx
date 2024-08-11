import DeleteIconButton from '@/app/(admin)/components/DeleteIconButton';
import FieldView from '@/app/(admin)/components/FieldView';
import HeaderDisplay from '@/app/(admin)/components/HeaderDisplay';
import { Box, Fieldset, Stack, Text } from '@mantine/core';
import { notFound } from 'next/navigation';
import { deleteUpdate, getUpdate } from '../actions';

type Props = {
  params: {
    id: string;
  };
};
export default async function Page({ params: { id } }: Props) {
  const item = await getUpdate(Number(id));
  if (!item) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <HeaderDisplay
        title={item.name}
        actionButtons={[<DeleteIconButton action={deleteUpdate} id={id} />]}
      />

      <Stack p={'xl'}>
        <FieldView label="Name">{item.name}</FieldView>
        <Fieldset legend="Description">
          <Text size="xs">{item.description}</Text>
        </Fieldset>
      </Stack>
    </Box>
  );
}
