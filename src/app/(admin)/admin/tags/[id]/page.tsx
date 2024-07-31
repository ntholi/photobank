import FieldView from '@/app/(admin)/components/FieldView';
import HeaderDisplay from '@/app/(admin)/components/HeaderDisplay';
import prisma from '@/lib/prisma';
import {
  Box,
  Button,
  Fieldset,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from '@mantine/core';
import { Label } from '@prisma/client';
import { notFound } from 'next/navigation';
type Props = {
  params: {
    id: string;
  };
};
export default async function Page({ params: { id } }: Props) {
  const item = await prisma.tag.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      labels: true,
    },
  });

  if (!item) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <HeaderDisplay
        title={item.name}
        actionButtons={[<Button>Button</Button>]}
      />

      <Box p={'xl'}>
        <Stack>
          <FieldView label="Name" value={item.name} />
          <Fieldset legend="Labels" mt={'md'}>
            <ItemsTable labels={item.labels} />
          </Fieldset>
        </Stack>
      </Box>
    </Box>
  );
}

function ItemsTable({ labels }: { labels: Label[] }) {
  const rows = labels.map((it) => (
    <TableTr key={it.id}>
      <TableTd>{it.id}</TableTd>
      <TableTd>{it.name}</TableTd>
    </TableTr>
  ));
  return (
    <Table>
      <TableThead>
        <TableTr>
          <TableTh></TableTh>
          <TableTh>Name</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>{rows}</TableTbody>
    </Table>
  );
}
