import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import {
  getContributorApplication,
  deleteContributorApplication,
} from '../actions';
import { Box, Fieldset, Group, Paper, Stack, Text } from '@mantine/core';
import StatusUpdater from './StatusUpdater';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContributorApplicationDetails({ params }: Props) {
  const { id } = await params;
  const application = await getContributorApplication(Number(id));

  if (!application) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        title={'ContributorApplication'}
        queryKey={['contributor-applications']}
        handleDelete={async () => {
          'use server';
          await deleteContributorApplication(Number(id));
        }}
      />
      <DetailsViewBody>
        <Group grow align='stretch'>
          <Paper withBorder p={'md'}>
            <Stack>
              <FieldView label='Name'>{application.user.name}</FieldView>
              <FieldView label='Email'>{application.user.email}</FieldView>
            </Stack>
          </Paper>
          <Paper withBorder p={'md'} style={{ position: 'relative' }}>
            <StatusUpdater application={application} />
          </Paper>
        </Group>
        <Box mt={'lg'}>
          <Fieldset legend='Motivation'>
            <Text>{application.message}</Text>
          </Fieldset>
        </Box>
      </DetailsViewBody>
    </DetailsView>
  );
}
