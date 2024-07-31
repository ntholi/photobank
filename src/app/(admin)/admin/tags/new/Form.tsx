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
import { Label, Tag } from '@prisma/client';
import { IconTrashFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type Props = {
  onSubmit: (
    values: Tag & {
      labels: Label[];
    },
  ) => Promise<Tag>;
};

export default function Form({ onSubmit }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [labels, setLabels] = useState<Label[]>([]);
  const { setValues, ...form } = useForm<Tag>({
    validate: {
      name: isNotEmpty('Name is required'),
    },
  });

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
  labels: Label[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
};

function LabelsInput({ labels, setLabels }: LabelsInputProps) {
  const form = useForm<Label>();

  function handleSubmit() {
    console.log(form.validate());
    if (!form.validate().hasErrors) {
      setLabels((prev) => [...prev, form.values]);
      form.setValues({
        name: '',
      });
    }
  }

  const rows = labels.map((it) => (
    <Table.Tr key={it.id}>
      <Table.Td>{it.name}</Table.Td>
      <Table.Td>
        <ActionIcon
          color="red"
          variant="light"
          onClick={() => {
            setLabels((prev) => prev.filter((label) => label.name !== it.name));
          }}
        >
          <IconTrashFilled size={'1rem'} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper mt={'lg'} p={'sm'} pb={'xl'} withBorder>
      <Title order={4} fw={100} mb={5}>
        Labels
      </Title>
      <Divider />
      <form>
        <Flex mt={'lg'} justify="space-between" align={'center'}>
          <Group>
            <TextInput placeholder="Name" {...form.getInputProps('name')} />
          </Group>
          <Button variant="default" onClick={handleSubmit}>
            Add
          </Button>
        </Flex>
      </form>
      <Divider my={15} />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Paper>
  );
}
