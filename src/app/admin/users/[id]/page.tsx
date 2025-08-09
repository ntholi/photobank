import {
  DetailsView,
  DetailsViewBody,
  DetailsViewHeader,
  FieldView,
} from '@/components/adease';
import { largeProfilePic, toTitleCase } from '@/utils/utils';
import {
  Avatar,
  Badge,
  Card,
  Center,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { notFound } from 'next/navigation';
import { deleteUser, getUser } from '../../../../server/users/actions';
import { UserRole } from '@/db/schema';

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
        title={users.name ?? 'User'}
        queryKey={['users']}
        handleDelete={async () => {
          'use server';
          await deleteUser(id);
        }}
      />
      <DetailsViewBody>
        <Grid>
          <GridCol span={{ base: 12, md: 5 }}>
            <Card withBorder p={'sm'}>
              <Center>
                <Avatar src={largeProfilePic(users.image)} size={200} />
              </Center>
            </Card>
          </GridCol>
          <GridCol span={{ base: 12, md: 7 }}>
            <Stack gap={'lg'} p={'sm'}>
              <FieldView label='Name'>{users.name}</FieldView>
              <Group align='center'>
                <Text c='dimmed' size='0.95rem'>
                  Role
                </Text>
                <Badge color={getRoleColor(users.role)}>
                  {toTitleCase(users.role)}
                </Badge>
              </Group>
              <FieldView label='Email'>{users.email}</FieldView>
            </Stack>
          </GridCol>
        </Grid>
      </DetailsViewBody>
    </DetailsView>
  );
}

function getRoleColor(role: UserRole) {
  switch (role) {
    case 'admin':
      return 'red';
    case 'user':
      return 'blue';
    default:
      return 'gray';
  }
}
