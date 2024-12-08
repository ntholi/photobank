'use client';

import { Prisma, Tag } from '@prisma/client';
import { Form } from '@/components/adease';
import { ActionIcon, Group, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Divider, Flex, Stack, Table, Title } from '@mantine/core';
import { IconTrashFilled } from '@tabler/icons-react';

type Props = {
  onSubmit: (values: Tag) => Promise<Tag>;
  defaultValues?: Prisma.TagGetPayload<{}>;
  onSuccess?: (value: Tag) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>,
  ) => void;
  title?: string;
};

export default function TagForm({ onSubmit, defaultValues, title }: Props) {
  const router = useRouter();

  return (
    <Form
      title={title}
      action={onSubmit}
      queryKey={['tags']}
      defaultValues={defaultValues}
      onSuccess={({ id }) => {
        router.push(`/admin/tags/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='Name' {...form.getInputProps('name')} />
          <LabelsInput {...form.getInputProps('labels')} />
        </>
      )}
    </Form>
  );
}

type LabelsInputProps = {
  value?: String[];
  onChange?: (value: String[]) => void;
};

function LabelsInput({ value = [], onChange }: LabelsInputProps) {
  const [inputValue, setInputValue] = useState<String>('');
  const labels = value;

  function handleSubmit() {
    if (inputValue) {
      onChange?.([...labels, inputValue]);
      setInputValue('');
    }
  }

  function handleDelete(index: number) {
    onChange?.(labels.filter((_, i) => i !== index));
  }

  return (
    <Stack mt={'lg'}>
      <Flex justify='space-between'>
        <Title order={4} fw={'normal'}>
          Labels
        </Title>
      </Flex>
      <Group justify='space-between'>
        <TextInput
          placeholder='Label'
          w={300}
          value={inputValue as string}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={handleSubmit} variant='default'>
          Add
        </Button>
      </Group>
      <Divider />
      <Table>
        <Table.Tbody>
          {labels.map((label, index) => (
            <Table.Tr key={index}>
              <Table.Td>{label}</Table.Td>
              <Table.Td align='right'>
                <ActionIcon color='red' onClick={() => handleDelete(index)}>
                  <IconTrashFilled size={'1rem'} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
