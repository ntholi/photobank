'use client';

import { ActionIcon, Divider, Flex, Group, Title } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DeleteButton } from './DeleteButton';

export interface DetailsViewHeaderProps {
  title: string;
  queryKey: string[];
  handleDelete?: () => Promise<void>;
  onDeleteSuccess?: () => Promise<void>;
}

export function DetailsViewHeader({
  title,
  queryKey,
  handleDelete,
  onDeleteSuccess,
}: DetailsViewHeaderProps) {
  const pathname = usePathname();

  return (
    <>
      <Flex justify={'space-between'} align={'center'}>
        <Title order={3} fw={100}>
          {title}
        </Title>
        <Group>
          {handleDelete && (
            <DeleteButton
              handleDelete={handleDelete}
              onSuccess={onDeleteSuccess}
              queryKey={queryKey}
            />
          )}
          <ActionIcon
            component={Link}
            href={`${pathname}/edit`}
            variant='outline'
          >
            <IconEdit size={'1rem'} />
          </ActionIcon>
        </Group>
      </Flex>
      <Divider my={15} />
    </>
  );
}
