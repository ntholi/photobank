'use client';
import FormHeader from '@/app/(admin)/components/FormHeader';
import { formatDate } from '@/lib/format';
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Group,
  Stack,
  Table,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { Update } from '@prisma/client';
import { IconTrashFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { z } from 'zod';

type Props = {
  value?: Update;
  onSubmit: (values: Update) => Promise<Update>;
};

const schema = z.object({
  name: z.string(),
});

const defaultValues = {
  id: 0,
  name: formatDate(new Date()),
  features: [],
  createdAt: new Date(),
};

export default function Form({ onSubmit, value }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [features, setFeatures] = useState<String[]>([]);
  const { setValues, ...form } = useForm<Update>({
    initialValues: value || defaultValues,
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (value) {
      setFeatures(value?.features);
    }
  }, [value]);

  async function handleSubmit(values: Update) {
    startTransition(async () => {
      const { id } = await onSubmit(Object.assign(values, { features }));
      router.push(`/admin/updates/${id}`);
    });
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <FormHeader title="Updates" isLoading={pending} />
      <Stack p={'xl'}>
        <TextInput
          label="Update"
          defaultValue={formatDate(new Date())}
          placeholder="Name"
          {...form.getInputProps('name')}
        />
        <FeaturesInput features={features} setFeatures={setFeatures} />
      </Stack>
    </form>
  );
}

type FeaturesInputProps = {
  features: String[];
  setFeatures: React.Dispatch<React.SetStateAction<String[]>>;
};

function FeaturesInput({ features, setFeatures }: FeaturesInputProps) {
  const [value, setValue] = useState<String>('');

  function handleSubmit() {
    if (value) {
      setFeatures((prev) => [...prev, value]);
      setValue('');
    }
  }

  function handleDelete(index: number) {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Stack mt={'lg'}>
      <Flex justify="space-between">
        <Title order={4} fw={'normal'}>
          Features
        </Title>
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
          {features.map((label, index) => (
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
