import DeleteIconButton from '@/app/(admin)/components/DeleteIconButton';
import FieldView from '@/app/(admin)/components/FieldView';
import HeaderDisplay from '@/app/(admin)/components/HeaderDisplay';
import { Box, Fieldset, List, ListItem, Stack } from '@mantine/core';
import { notFound } from 'next/navigation';
import {
  deleteContributorApplication,
  getContributorApplication,
} from '../actions';

type Props = {
  params: {
    id: string;
  };
};
export default async function Page({ params: { id } }: Props) {
  const item = await getContributorApplication(Number(id));
  if (!item) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <HeaderDisplay
        title={item.user.name || item.user.email}
        actionButtons={[
          <DeleteIconButton action={deleteContributorApplication} id={id} />,
        ]}
      />

      <Stack p={'xl'}>
        <FieldView label="Name" value={item.user.name} />
        <FieldView label={item.message || 'Empty'} value={'Motivation'} />
      </Stack>
    </Box>
  );
}
