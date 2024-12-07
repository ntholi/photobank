'use client';
import { ActionIcon, Divider, Flex, Group, Title } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type props = {
  title: string;
  actionButtons?: React.ReactNode[];
};
export default function HeaderDisplay({ title, actionButtons }: props) {
  const pathname = usePathname();
  return (
    <>
      <Flex justify={'space-between'} align={'center'}>
        <Title order={3} fw={100}>
          {title}
        </Title>
        <Group>
          {actionButtons}
          <ActionIcon
            component={Link}
            size={'lg'}
            href={`${pathname}/edit`}
            variant='default'
          >
            <IconEdit size={'1.1rem'} />
          </ActionIcon>
        </Group>
      </Flex>
      <Divider my={15} />
    </>
  );
}
