'use client';
import {
  ActionIcon,
  Button,
  CloseButton,
  Divider,
  Flex,
  Group,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowNarrowLeft, IconDeviceFloppy } from '@tabler/icons-react';

type Props = {
  title?: string;
  onClose?: () => void;
  isLoading?: boolean;
};

export default function FormHeader({ title, isLoading, onClose }: Props) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <Flex justify={title ? 'space-between' : 'end'} align={'center'}>
        {isMobile ? (
          <Group>
            <ActionIcon variant='default' onClick={onClose}>
              <IconArrowNarrowLeft size={'1rem'} />
            </ActionIcon>
            <Title order={3} fw={100} size={'1rem'}>
              {title}
            </Title>
          </Group>
        ) : (
          <Title order={3} fw={100}>
            {title}
          </Title>
        )}
        <Group>
          <Button
            type='submit'
            loading={isLoading}
            leftSection={<IconDeviceFloppy size={'1rem'} />}
          >
            Save
          </Button>
          {!isMobile && (
            <>
              <Divider orientation='vertical' />
              <CloseButton size={'lg'} onClick={onClose} />
            </>
          )}
        </Group>
      </Flex>
      <Divider my={15} />
    </>
  );
}
