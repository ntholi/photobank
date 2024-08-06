import DeleteIconButton from '@/app/(admin)/components/DeleteIconButton';
import FieldView from '@/app/(admin)/components/FieldView';
import HeaderDisplay from '@/app/(admin)/components/HeaderDisplay';
import { Box, Fieldset, List, ListItem, Stack } from '@mantine/core';
import { notFound } from 'next/navigation';
import { deleteTag, getTag } from '../actions';

type Props = {
  params: {
    id: string;
  };
};
export default async function Page({ params: { id } }: Props) {
  const item = await getTag(Number(id));
  if (!item) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <HeaderDisplay
        title={item.name}
        actionButtons={[<DeleteIconButton action={deleteTag} id={id} />]}
      />

      <Stack p={'xl'}>
        <FieldView label="Name">{item.name}</FieldView>
        <Fieldset legend="Labels">
          <List type="ordered" mt={'sm'}>
            {item.labels.map((it) => (
              <ListItem>{it}</ListItem>
            ))}
          </List>
        </Fieldset>
      </Stack>
    </Box>
  );
}
