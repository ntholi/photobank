import DeleteIconButton from '@/app/(admin)/components/DeleteIconButton';
import FieldView from '@/app/(admin)/components/FieldView';
import HeaderDisplay from '@/app/(admin)/components/HeaderDisplay';
import {
  Box,
  Card,
  Grid,
  GridCol,
  Stack,
  Image,
  Title,
  Text,
  Group,
  Divider,
  Anchor,
} from '@mantine/core';
import { notFound } from 'next/navigation';
import { deletePhoto, getPhoto } from '../actions';
import { thumbnail } from '@/lib/config/urls';
import NextLink from 'next/link';

type Props = {
  params: {
    id: string;
  };
};
export default async function Page({ params: { id } }: Props) {
  const item = await getPhoto(id);
  if (!item) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <HeaderDisplay
        title={item.id}
        actionButtons={[<DeleteIconButton action={deletePhoto} id={id} />]}
      />

      <Grid p="lg">
        <GridCol span={{ base: 12, md: 5 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Image
              radius="md"
              h={200}
              w="auto"
              fit="contain"
              src={thumbnail(item.fileName)}
              alt={item.caption || 'Lehakoe'}
            />
            <Group justify="space-between" mt={'md'}>
              <Text>ID</Text>
              <Text size={'xs'} c="dimmed">
                <Anchor href="">{item.id}</Anchor>
              </Text>
            </Group>
            <Stack mt="xl" gap="sm">
              <Group justify="space-between">
                <Text>Name</Text>
                <Text fw={500} size="0.9rem">
                  {item.fileName}
                </Text>
              </Group>
              <Divider my={5} />
              <Group justify="space-between">
                <Text>Email</Text>
                <Text fw={500}>{item.status}</Text>
              </Group>
              <Divider />
              <Group justify="space-between">
                <Text>Phone</Text>
                <Text fw={500}>{item.locationId}</Text>
              </Group>
              <Divider />
            </Stack>
          </Card>
        </GridCol>
      </Grid>
    </Box>
  );
}
