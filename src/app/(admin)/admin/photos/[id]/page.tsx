import DeleteIconButton from '@/app/(admin)/components/DeleteIconButton';
import HeaderDisplay from '@/app/(admin)/components/HeaderDisplay';
import { thumbnail } from '@/lib/config/urls';
import { profilePath } from '@/lib/constants';
import { dateTime } from '@/lib/format';
import {
  Anchor,
  Badge,
  Box,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  Image,
  List,
  ListItem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { PhotoStatus } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import { deletePhoto, getPhoto } from '../actions';

type Props = {
  params: Promise<{
    id: string;
  }>;
};
export default async function Page(props: Props) {
  const params = await props.params;
  const { id } = params;

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

      <Grid p='lg'>
        <GridCol span={{ base: 12, md: 6 }}>
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Image
              radius='md'
              h={200}
              w='auto'
              fit='contain'
              src={thumbnail(item.fileName)}
              alt={item.description || 'Lehakoe'}
            />
            <Group justify='space-between' mt={'md'}>
              <Text>ID</Text>
              <Text size={'xs'} c='dimmed'>
                <Anchor
                  component={Link}
                  target='_blank'
                  href={`/photos/${item.id}`}
                >
                  {item.id}
                </Anchor>
              </Text>
            </Group>
            <Stack mt='xl' gap='sm'>
              <FieldView label='File Name'>{item.fileName}</FieldView>
              <Divider my={5} />
              <FieldView label='Status'>
                <Status value={item.status} />
              </FieldView>
              <Divider />
              <FieldView label='Owner'>
                <Anchor
                  size='0.9rem'
                  target='_blank'
                  component={Link}
                  href={profilePath(item.user)}
                >
                  {item.user.name}
                </Anchor>
              </FieldView>
              <Divider />
              <FieldView label='Location'>{item.location?.name}</FieldView>
              <Divider />
              <FieldView label='Date Uploaded'>
                {dateTime(item.createdAt)}
              </FieldView>
            </Stack>
          </Card>
        </GridCol>
        <GridCol span={{ base: 12, md: 6 }}>
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Text size='0.9rem'>{item.description}</Text>
          </Card>
        </GridCol>
      </Grid>
      <Stack p={'xl'} gap={'sm'}>
        <Title order={3} fw={'lighter'}>
          Labels
        </Title>
        <Divider />
        <List>
          {item.labels.map((it) => (
            <ListItem>
              <Text size='0.8rem'>{it.label}</Text>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Box>
  );
}

type FieldViewProps = {
  label: string;
  children: React.ReactNode;
};

function FieldView({ label, children }: FieldViewProps) {
  return (
    <Group justify='space-between'>
      <Text size='0.9rem'>{label}</Text>
      {React.isValidElement(children) ? (
        children
      ) : (
        <Text size='0.85rem' fw={500}>
          {children}
        </Text>
      )}
    </Group>
  );
}

function Status({ value }: { value: PhotoStatus }) {
  let color = 'gray';
  switch (value) {
    case 'pending':
      color = 'orange';
      break;
    case 'rejected':
      color = 'red';
      break;
  }
  return (
    <Badge size='sm' color={color}>
      {value}
    </Badge>
  );
}
