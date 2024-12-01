'use client';
import {
  Button,
  CloseButton,
  Divider,
  Flex,
  Group,
  Title,
} from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';

type Props = {
  title?: string;
  onClose?: () => void;
  isLoading?: boolean;
};

export default function FormHeader({ title, isLoading, onClose }: Props) {
  return (
    <>
      <Flex justify={title ? 'space-between' : 'end'} align={'center'}>
        {title && (
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
          <CloseButton size={'lg'} onClick={onClose} />
        </Group>
      </Flex>
      <Divider my={15} />
    </>
  );
}
