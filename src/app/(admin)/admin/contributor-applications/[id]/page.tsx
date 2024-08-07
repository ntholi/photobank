import DeleteIconButton from '@/app/(admin)/components/DeleteIconButton';
import FieldView from '@/app/(admin)/components/FieldView';
import HeaderDisplay from '@/app/(admin)/components/HeaderDisplay';
import {
  Box,
  Fieldset,
  Flex,
  Group,
  List,
  ListItem,
  SegmentedControl,
  Text,
  Stack,
  Divider,
} from '@mantine/core';
import { notFound } from 'next/navigation';
import { deleteApplication, getApplication } from '../actions';
import StatusUpdater from './StatusUpdater';

type Props = {
  params: {
    id: string;
  };
};
export default async function Page({ params: { id } }: Props) {
  const item = await getApplication(Number(id));
  if (!item) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <HeaderDisplay
        title={item.user.name || item.user.email}
        actionButtons={[
          <DeleteIconButton action={deleteApplication} id={id} />,
        ]}
      />

      <Stack p={'xl'}>
        <Group justify={'space-between'} align="start">
          <Stack w={'50%'}>
            <FieldView label="Name">{item.user.name}</FieldView>
            <FieldView label="Email">{item.user.email}</FieldView>
          </Stack>
          <StatusUpdater application={item} />
        </Group>
        <Stack mt={'lg'} gap={'xs'}>
          <Fieldset legend="Motivation">
            <Text>{item.message}</Text>
          </Fieldset>
        </Stack>
      </Stack>
    </Box>
  );
}
