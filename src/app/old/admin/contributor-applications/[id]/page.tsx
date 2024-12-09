import DeleteIconButton from '@/app/old/components/DeleteIconButton';
import FieldView from '@/app/old/components/FieldView';
import HeaderDisplay from '@/app/old/components/HeaderDisplay';
import { Box, Fieldset, Group, Stack, Text } from '@mantine/core';
import { notFound } from 'next/navigation';
import { deleteApplication, getApplication } from '../actions';
import StatusUpdater from '../../../../admin/contributor-applications/[id]/StatusUpdater';

type Props = {
  params: Promise<{
    id: string;
  }>;
};
export default async function Page(props: Props) {
  const params = await props.params;

  const { id } = params;

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
        <Group justify={'space-between'} align='start'>
          <Stack w={'50%'}>
            <FieldView label='Name'>{item.user.name}</FieldView>
            <FieldView label='Email'>{item.user.email}</FieldView>
          </Stack>
          <StatusUpdater application={item} />
        </Group>
        <Stack mt={'lg'} gap={'xs'}>
          <Fieldset legend='Motivation'>
            <Text>{item.message}</Text>
          </Fieldset>
        </Stack>
      </Stack>
    </Box>
  );
}
