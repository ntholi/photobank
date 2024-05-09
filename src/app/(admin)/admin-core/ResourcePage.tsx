'use client';
import {
  Box,
  Button,
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
  Text,
} from '@mantine/core';
import type { UrlObject } from 'url';
import React, { useContext, useEffect, useState } from 'react';
import Navbar from './Navbar';
import SearchField from './components/SearchField';
import CreateButton from './components/CreateButton';
import DeleteButton from './components/DeleteButton';
import { Repository, Resource } from './repository/repository';
import { useQueryState } from 'nuqs';
import RepositoryDataProvider, {
  FirestoreDataContext,
} from './RepositoryDataProvider';

type Props<T extends Resource> = {
  children?: React.ReactNode;
  resourceLabel: string;
  repository: Repository<T>;
  details: React.ComponentType<{ item: T }>;
  create?: React.ComponentType<{
    repository: Repository<T>;
  }>;
  edit?: React.ComponentType<{
    repository: Repository<T>;
    resource: T;
  }>;
  navLinkProps: (
    item: T,
    index: number,
  ) => NavLinkProps & { href?: string | UrlObject };
};

export default function ResourcePageContainer<T extends Resource>(
  props: Props<T>,
) {
  return (
    <RepositoryDataProvider repository={props.repository}>
      <ResourcePage {...props} />
    </RepositoryDataProvider>
  );
}

function ResourcePage<T extends Resource>(props: Props<T>) {
  const {
    children,
    repository,
    navLinkProps,
    details,
    create,
    edit,
    resourceLabel,
  } = props;
  const [view] = useQueryState('view');
  const [id] = useQueryState('id');
  const [selected, setSelected] = useState<T>();
  const { data, loading } = useContext(FirestoreDataContext);

  useEffect(() => {
    if (id) {
      setSelected(data.find((item) => item.id === id));
    }
  }, [data, id]);

  let body: React.ReactNode = children;
  if (selected && id && !view) {
    body = React.createElement(details, { item: selected });
  } else if (create && view === 'create') {
    body = React.createElement(create, { repository });
  } else if (edit && selected && view === 'edit') {
    body = React.createElement(edit, {
      repository,
      resource: selected,
    });
  } else {
    body = children;
    if (!children) {
      body = <NothingSelectedView title={props.resourceLabel} />;
    }
  }

  return (
    <Grid columns={14} gutter={'xl'}>
      <GridCol span={{ base: 13, sm: 4 }} pr={{ base: 7, sm: 0 }}>
        <Paper withBorder>
          <Flex>
            <Stack gap={0} w={'100%'}>
              <Flex h={60} p='md' justify='space-between'>
                <CreateButton disabled={!create} />
                <DeleteButton repository={repository} />
              </Flex>
              <SearchField />
              <Divider />
              <ScrollArea h={{ base: 150, sm: '71vh' }} type='always' p={'sm'}>
                <Navbar navLinkProps={navLinkProps} />
              </ScrollArea>
            </Stack>
          </Flex>
        </Paper>
      </GridCol>
      <GridCol span={{ base: 13, sm: 10 }} pos={'relative'}>
        <Paper withBorder>
          <Header showEditButton={!!edit} resourceLabel={resourceLabel} />
          <ScrollArea h='78vh' type='always'>
            {loading ? <Loading /> : body}
          </ScrollArea>
        </Paper>
      </GridCol>
    </Grid>
  );
}

function Header({
  showEditButton,
  resourceLabel,
}: {
  showEditButton: boolean;
  resourceLabel: string;
}) {
  const [_, setView] = useQueryState('view');
  const [id, setId] = useQueryState('id');

  return (
    <>
      <Flex justify='space-between' align={'center'} h={60} p='md'>
        <Title size={18} fw={500}>
          {resourceLabel}
        </Title>
        <Group>
          {id && showEditButton && (
            <Button type='submit' color='dark' onClick={() => setView('edit')}>
              Edit
            </Button>
          )}
          <Divider orientation='vertical' />
          <CloseButton
            size='lg'
            variant='transparent'
            onClick={async () => {
              await setView(null);
              await setId(null);
            }}
          />
        </Group>
      </Flex>
      <Divider />
    </>
  );
}

function Loading() {
  return (
    <Stack py={50} px={70} pb={120} gap={'lg'}>
      <Skeleton mt='sm' h={50} w='100%' />
      <Skeleton h={160} w='100%' />
      <Skeleton h={160} w='100%' />
    </Stack>
  );
}

function NothingSelectedView({ title }: { title: string }) {
  return (
    <Stack align='center' gap={5} justify='center' mt='30vh'>
      <div>
        <Title fw={400} c='gray'>
          {title}
        </Title>
        <Text pl={3} c='gray' size='xs'>
          Nothing Selected
        </Text>
      </div>
    </Stack>
  );
}
