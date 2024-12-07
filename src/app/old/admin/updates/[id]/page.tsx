import DeleteIconButton from '@/app/old/components/DeleteIconButton';
import FieldView from '@/app/old/components/FieldView';
import HeaderDisplay from '@/app/old/components/HeaderDisplay';
import { Box, Fieldset, List, ListItem, Stack } from '@mantine/core';
import { notFound } from 'next/navigation';
import { deleteUpdate, getUpdate } from '../actions';

type Props = {
  params: Promise<{
    id: string;
  }>;
};
export default async function Page(props: Props) {
  const params = await props.params;
  const { id } = params;

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
        <FieldView label='Name'>{item.name}</FieldView>
        <Fieldset legend='Features'>
          <List mt={'sm'}>
            {item.features.map((it) => (
              <ListItem>{it}</ListItem>
            ))}
          </List>
        </Fieldset>
      </Stack>
    </Box>
  );
}
