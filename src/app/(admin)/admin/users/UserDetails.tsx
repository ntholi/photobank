import {
  Grid,
  GridCol,
  Card,
  Title,
  Group,
  Stack,
  Divider,
  Image,
  Text,
} from '@mantine/core';
import React from 'react';
import RoleUpdater from './RoleUpdater';
import { User } from '@prisma/client';
// import { largeProfilePic } from '@/lib/utils';
// import { User } from './model/user';

export default function UserDetails({ item }: { item: User }) {
  return (
    <Grid p="lg">
      <GridCol span={{ base: 12, md: 5 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Image
            radius="md"
            h={200}
            w="auto"
            fit="contain"
            // src={largeProfilePic(item.image)}
            // alt={item.firstName}
          />
          <Title order={3}>{item.name}</Title>
          <Group justify="space-between">
            <Text>ID</Text>
            <Text size={'xs'} c="dimmed">
              {item.id}
            </Text>
          </Group>
          <Stack mt="xl" gap="sm">
            <Group justify="space-between">
              <Text>Names</Text>
              <Text fw={500}>{item.name}</Text>
            </Group>
            <Divider my={5} />
            <Divider />
            <Group justify="space-between">
              <Text>Email</Text>
              <Text fw={500}>{item.email}</Text>
            </Group>
            <Divider />
            <Group justify="space-between">
              <Text>Phone</Text>
              {/* <Text fw={500}>{item.phoneNumbers?.at(0)}</Text> */}
            </Group>
            <Divider />
          </Stack>
        </Card>
      </GridCol>
      <GridCol span={{ base: 12, md: 7 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          {/* <RoleUpdater user={{ id: item.id!, roles: item.roles }} /> */}
        </Card>
      </GridCol>
    </Grid>
  );
}
