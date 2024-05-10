import prisma from '@/lib/db';
import {
  CloseButton,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import Navbar from '../../admin-core/Navbar';
import CreateButton from '../../admin-core/components/CreateButton';
import DeleteButton from '../../admin-core/components/DeleteButton';
import SearchField from '../../admin-core/components/SearchField';
import { deleteCategory } from './actions';

export default async function Layout({ children }: PropsWithChildren) {
  const data = prisma.category.findMany();
  return (
    <Grid columns={14} gutter={'xl'}>
      <GridCol span={{ base: 13, sm: 4 }} pr={{ base: 7, sm: 0 }}>
        <Paper withBorder>
          <Flex>
            <Stack gap={0} w={'100%'}>
              <Flex h={60} p="md" justify="space-between">
                <CreateButton href="/admin/categories/new" />
                <DeleteButton onClick={deleteCategory} />
              </Flex>
              <SearchField />
              <Divider />
              <ScrollArea h={{ base: 150, sm: '71vh' }} type="always" p={'sm'}>
                <Navbar
                  data={data}
                  navLinkProps={(it) => ({
                    label: it.name,
                    href: `/admin/categories/${it.id}`,
                  })}
                />
              </ScrollArea>
            </Stack>
          </Flex>
        </Paper>
      </GridCol>
      <GridCol span={{ base: 13, sm: 10 }} pos={'relative'}>
        <Paper withBorder>
          <Header resourceLabel={'Hello World'} />
          <ScrollArea h="78vh" type="always">
            {children}
          </ScrollArea>
        </Paper>
      </GridCol>
    </Grid>
  );
}

function Header({ resourceLabel }: { resourceLabel: string }) {
  return (
    <>
      <Flex justify="space-between" align={'center'} h={60} p="md">
        <Title size={18} fw={500}>
          {resourceLabel}
        </Title>
        <Group>
          <Divider orientation="vertical" />
          <CloseButton
            component={Link}
            href={'.'}
            size="lg"
            variant="transparent"
          />
        </Group>
      </Flex>
      <Divider />
    </>
  );
}
