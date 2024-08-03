import prisma from '@/lib/prisma';
import { toDateTime } from '@/lib/utils';
import {
  Anchor,
  Badge,
  Divider,
  Group,
  Paper,
  Stack,
  Table,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import RowActions from './RowActions';
import { Role } from '@prisma/client';
import UserFilter from './UserFilter';

type Props = {
  searchParams: { role?: Role };
};

async function getUsers(role?: Role) {
  if (role) {
    return await prisma.user.findMany({ where: { role } });
  }
  return await prisma.user.findMany();
}

export default async function UserPage({ searchParams }: Props) {
  const data = await getUsers(searchParams.role);

  const rows = data.map((user) => (
    <TableTr key={user.id}>
      <TableTd>
        <Anchor component={Link} target="_blank" href={`/${user.username}`}>
          {user.username}
        </Anchor>
      </TableTd>
      <TableTd>{user.name || '(Empty)'}</TableTd>
      <TableTd>{user.email}</TableTd>
      <TableTd>{user.role}</TableTd>
      <TableTd>
        <Badge variant="default" size="sm">
          {user.blocked ? 'Blocked' : 'Active'}
        </Badge>
      </TableTd>
      <TableTd>{toDateTime(user.createdAt)}</TableTd>
      <TableTd>
        <RowActions user={user} />
      </TableTd>
    </TableTr>
  ));

  return (
    <Stack>
      <Paper p="lg" withBorder>
        <Group>
          <Title fw={400} size={18} c="gray">
            Users
          </Title>
          <Divider orientation="vertical" />
          <UserFilter />
        </Group>
      </Paper>
      <Paper p="lg" withBorder>
        <Table highlightOnHover>
          <TableThead>
            <TableTr>
              <TableTh>Username</TableTh>
              <TableTh>Name</TableTh>
              <TableTh>Email</TableTh>
              <TableTh>Role</TableTh>
              <TableTh>Status</TableTh>
              <TableTh>Date Created</TableTh>
            </TableTr>
          </TableThead>
          {rows}
        </Table>
      </Paper>
    </Stack>
  );
}
