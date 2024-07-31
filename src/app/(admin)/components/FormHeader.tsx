'use client';
import { Button, Divider, Flex, Title } from '@mantine/core';
import React from 'react';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useFormStatus } from 'react-dom';

type Props = {
  title: string;
  isLoading?: boolean;
};

export default function FormHeader({ title, isLoading }: Props) {
  return (
    <>
      <Flex justify={'space-between'} align={'center'}>
        <Title order={3} fw={100}>
          {title}
        </Title>
        <Button
          type='submit'
          loading={isLoading}
          leftSection={<IconDeviceFloppy size={'1.2rem'} />}
        >
          Save
        </Button>
      </Flex>
      <Divider my={15} />
    </>
  );
}
