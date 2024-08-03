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
            <FieldView label="Name" value={item.user.name} />
            <FieldView label="Email" value={item.user.email} />
          </Stack>
          <StatusUpdater status={item.status} id={Number(id)} />
        </Group>
        <Stack mt={'lg'} gap={'xs'}>
          <Text size="sm" fw={500}>
            Motivation
          </Text>
          <Divider />
        </Stack>
      </Stack>
    </Box>
  );
}
