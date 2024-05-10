import {
  CloseButton,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  NavLinkProps,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { PropsWithChildren, Suspense } from 'react';
import Navbar from './Navbar';
import CreateButton from './components/CreateButton';
import DeleteButton from './components/DeleteButton';
import SearchField from './components/SearchField';
import { UrlObject } from 'url';

interface WithId {
  id: string | number;
}
type Props<T extends WithId> = {
  onDelete?: (id: string) => Promise<void>;
  data: Promise<T[]>;
  navLinkProps: (item: T) => {
    id: string | number;
    description?: string;
    label: string;
    href: string;
  };
} & PropsWithChildren;

export default async function ResourcePage<T extends WithId>({
  children,
  data,
  navLinkProps,
  onDelete,
}: Props<T>) {
  return (
    <Grid columns={14} gutter={'xl'}>
      <GridCol span={{ base: 13, sm: 4 }} pr={{ base: 7, sm: 0 }}>
        <Paper withBorder>
          <Stack gap={0} w={'100%'}>
            <Suspense fallback={<Loader />}>
              <NavContainer data={data} navLinkProps={navLinkProps} />
            </Suspense>
          </Stack>
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

interface WithId {
  id: number | string;
}

type NavContainerProps<T extends WithId> = {
  navLinkProps: (
    item: T,
    index: number,
  ) => NavLinkProps & { id: string | number; href: string | UrlObject };
  data: Promise<T[]>;
};

async function NavContainer<T extends WithId>(props: NavContainerProps<T>) {
  const { navLinkProps, data } = props;
  const items = (await data).map((item, index) => navLinkProps(item, index));
  return <Navbar navLinks={items} />;
}

function Loader() {
  return (
    <>
      <Flex h={60} p="md" justify="space-between">
        <CreateButton disabled />
        <DeleteButton disabled />
      </Flex>
      <SearchField disabled />
      <Divider />
      <ScrollArea h={{ base: 150, sm: '71vh' }} type="always" p={'sm'}>
        <Stack>
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} h={41} />
          ))}
        </Stack>
      </ScrollArea>
    </>
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
