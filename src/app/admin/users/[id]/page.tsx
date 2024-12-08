import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import { getUser, deleteUser } from '../actions';
import { Card, CardSection, Grid, GridCol, Stack, Text } from '@mantine/core';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserDetails({ params }: Props) {
  const { id } = await params;
  const users = await getUser(id);

  if (!users) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        title={'User'}
        queryKey={['users']}
        handleDelete={async () => {
          'use server';
          await deleteUser(id);
        }}
      />
      <DetailsViewBody p={'xs'}>
        <Grid>
          <GridCol span={{ base: 12, md: 6 }}>
            <Card withBorder>
              <Stack gap={'sm'}>
                <FieldView label='Name'>{users.name}</FieldView>
                <FieldView label='Email'>{users.email}</FieldView>
                <FieldView label='Website'>{users.website}</FieldView>
                <FieldView label='Bio'>{users.bio}</FieldView>
              </Stack>
            </Card>
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <Card withBorder>
              <Stack gap={'sm'}>
                <FieldView label='Role'>{users.role}</FieldView>
                <FieldView label='Status'>{users.status}</FieldView>
              </Stack>
            </Card>
          </GridCol>
        </Grid>
      </DetailsViewBody>
    </DetailsView>
  );
}
