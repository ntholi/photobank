import prisma from '@/lib/db';
import {
  Table,
  TableTr,
  TableTd,
  TableThead,
  TableTh,
  Anchor,
  Paper,
  Title,
  Stack,
} from '@mantine/core';
import { toDateTime } from '@/lib/utils';
import RowActions from './RowActions';

export default async function UserPage() {
  const data = await prisma.user.findMany();
  const rows = data.map((user) => (
    <TableTr key={user.id}>
      <TableTd>{user.id}</TableTd>
      <TableTd>{user.name}</TableTd>
      <TableTd>{user.email}</TableTd>
      <TableTd>{user.role}</TableTd>
      <TableTd>{toDateTime(user.createdAt)}</TableTd>
      <TableTd>
        <RowActions user={user} />
      </TableTd>
    </TableTr>
  ));

  return (
    <Stack>
      <Paper p="lg" withBorder>
        <Title size={'sm'}>Users</Title>
      </Paper>
      <Paper p="lg" withBorder>
        <Table highlightOnHover>
          <TableThead>
            <TableTr>
              <TableTh>ID</TableTh>
              <TableTh>Name</TableTh>
              <TableTh>Email</TableTh>
              <TableTh>Role</TableTh>
              <TableTh>Date Created</TableTh>
            </TableTr>
          </TableThead>
          {rows}
        </Table>
      </Paper>
    </Stack>
  );
}
