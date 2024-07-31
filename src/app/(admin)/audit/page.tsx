import { asPastTense, dateTime } from '@/lib/format';
import prisma from '@/lib/prisma';
import {
  Anchor,
  Flex,
  Paper,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Title,
} from '@mantine/core';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CasePage() {
  const data = await prisma.auditLog.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  const rows = data.map((row) => (
    <TableTr key={row.id}>
      <TableTd>{dateTime(row.createdAt)}</TableTd>
      <TableTd>
        <Anchor component={Link} href={`#`} size='sm' c='dimmed'>
          {row.user.name}
        </Anchor>{' '}
        {asPastTense(row.action)} {asWord(row.model)}
      </TableTd>
      <TableTd align='right'>
        <Anchor component={Link} href={`#`} size='sm'>
          View
        </Anchor>
      </TableTd>
    </TableTr>
  ));
  return (
    <>
      <Paper p='md' withBorder>
        <Flex justify={'space-between'} align={'center'}>
          <Title size={'1rem'} fw={500}>
            Audit
          </Title>
        </Flex>
      </Paper>
      <Table withTableBorder mt={'lg'}>
        <TableThead>
          <TableTr>
            <TableTh>Date</TableTh>
            <TableTh>Action</TableTh>
            <TableTh></TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>{rows}</TableTbody>
      </Table>
    </>
  );
}

// converts modal name to proper word, eg ModalName to Modal Name
function asWord(modalName: string) {
  return modalName
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
