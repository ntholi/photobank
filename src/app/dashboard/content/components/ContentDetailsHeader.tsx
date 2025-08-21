'use client';

import { useViewSelect } from '@/hooks/useViewSelect';
import { ActionIcon, Divider, Flex, Group, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowNarrowLeft, IconEdit } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { DeleteButton } from '@/components/adease/DeleteButton';
import React from 'react';
import { UserRole, ContentStatus } from '@/db/schema';
import { useSession } from 'next-auth/react';
import { StatusBadge } from './StatusBadge';

export interface ContentDetailsHeaderProps {
  title: string;
  status: ContentStatus;
  queryKey: string[];
  handleDelete?: () => Promise<void>;
  onDeleteSuccess?: () => Promise<void>;
  deleteRoles?: UserRole[];
  editRoles?: UserRole[];
}

export function ContentDetailsHeader({
  title,
  status,
  queryKey,
  handleDelete,
  onDeleteSuccess,
  deleteRoles,
  editRoles,
}: ContentDetailsHeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [, setView] = useViewSelect();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set('view', 'details');

  return (
    <>
      <Flex justify={'space-between'} align={'center'}>
        {isMobile ? (
          <Group>
            <ActionIcon variant='default' onClick={() => setView('nav')}>
              <IconArrowNarrowLeft size={'1rem'} />
            </ActionIcon>
            <Title order={3} fw={100} size={'1rem'}>
              {title}
            </Title>
            <StatusBadge status={status} />
          </Group>
        ) : (
          <Group align='center' gap='lg'>
            <Title order={3} fw={100}>
              {title}
            </Title>
            <StatusBadge status={status} mt={5} />
          </Group>
        )}
        <Group>
          {handleDelete &&
            (deleteRoles?.includes(session?.user?.role as UserRole) ||
              session?.user?.role === 'admin') && (
              <DeleteButton
                handleDelete={handleDelete}
                onSuccess={onDeleteSuccess}
                queryKey={queryKey}
              />
            )}
          {(editRoles?.includes(session?.user?.role as UserRole) ||
            session?.user?.role === 'admin') && (
            <ActionIcon
              component={Link}
              href={`${pathname}/edit?${newSearchParams.toString()}`}
              variant='outline'
            >
              <IconEdit size={'1rem'} />
            </ActionIcon>
          )}
        </Group>
      </Flex>
      <Divider my={15} />
    </>
  );
}
