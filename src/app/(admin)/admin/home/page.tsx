import {
  Stack,
  Title,
  Paper,
  Flex,
  Button,
  Image,
  SimpleGrid,
  Box,
  ActionIcon,
} from '@mantine/core';
import React from 'react';
import prisma from '@/lib/prisma';
import AddButton from './AddButton';
import { revalidatePath } from 'next/cache';
import { thumbnail } from '@/lib/config/urls';
import { IconTrashFilled } from '@tabler/icons-react';
import DeleteButton from './DeleteButton';

export default async function HomePage() {
  const photos = await prisma.homePhoto.findMany({
    select: { photo: true },
  });

  async function handleAdd(photoId: string) {
    'use server';
    await prisma.homePhoto.create({
      data: {
        photoId,
      },
    });
    revalidatePath('/admin/home');
    revalidatePath('/');
  }

  async function handleDelete(photoId: string) {
    'use server';
    await prisma.homePhoto.delete({
      where: {
        photoId,
      },
    });
    revalidatePath('/admin/home');
    revalidatePath('/');
  }

  return (
    <Stack>
      <Paper p="lg" withBorder>
        <Flex justify={'space-between'} align={'center'}>
          <Title fw={'lighter'} size={18} c="gray">
            Home Page Photos
          </Title>
          <AddButton handleAdd={handleAdd} />
        </Flex>
      </Paper>
      <Paper p="lg" withBorder>
        <SimpleGrid cols={6}>
          {photos.map((it) => (
            <Box key={it.photo.id} pos={'relative'}>
              <Image src={thumbnail(it.photo.fileName)} />
              <DeleteButton
                pos={'absolute'}
                top={5}
                right={5}
                photo={it.photo}
                handleDelete={handleDelete}
              />
            </Box>
          ))}
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
