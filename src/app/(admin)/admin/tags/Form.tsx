'use client';
import FormHeader from '@/app/(admin)/components/FormHeader';
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  Stack,
  Table,
  TextInput,
  Title,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { Tag } from '@prisma/client';
import { IconTrashFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

type Props = {
  value?: Tag;
  onSubmit: (values: Tag) => Promise<Tag>;
};

export default function Form({ onSubmit, value }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [labels, setLabels] = useState<String[]>([]);
  const { setValues, ...form } = useForm<Tag>({
    initialValues: value,
    validate: {
      name: isNotEmpty('Name is required'),
    },
  });

  useEffect(() => {
    if (value) {
      setLabels(value?.labels);
    }
  }, [value]);

  async function handleSubmit(values: Tag) {
    startTransition(async () => {
      const { id } = await onSubmit(Object.assign(values, { labels }));
      router.push(`/admin/tags/${id}`);
    });
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <FormHeader title="Tags" isLoading={pending} />
      <Stack p={'xl'}>
        <TextInput
          label="Tag"
          placeholder="Name"
          {...form.getInputProps('name')}
        />
        <LabelsInput labels={labels} setLabels={setLabels} />
      </Stack>
    </form>
  );
}

type LabelsInputProps = {
  labels: String[];
  setLabels: React.Dispatch<React.SetStateAction<String[]>>;
};

function LabelsInput({ labels, setLabels }: LabelsInputProps) {
  const [value, setValue] = useState<String>('');

  function handleSubmit() {
    if (value) {
      setLabels((prev) => [...prev, value]);
      setValue('');
    }
  }

  function handleDelete(index: number) {
    setLabels((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Stack mt={'lg'}>
      <Flex justify="space-between">
        <Title order={3}>Labels</Title>
      </Flex>
      <Group justify="space-between">
        <TextInput
          placeholder="Label"
          w={300}
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={handleSubmit} variant="default">
          Add
        </Button>
      </Group>
      <Divider />
      <Table>
        <Table.Tbody>
          {labels.map((label, index) => (
            <Table.Tr key={index}>
              <Table.Td>{label}</Table.Td>
              <Table.Td align="right">
                <ActionIcon color="red" onClick={() => handleDelete(index)}>
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
