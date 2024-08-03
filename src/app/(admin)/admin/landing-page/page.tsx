import { thumbnail } from '@/lib/config/urls';
import prisma from '@/lib/prisma';
import {
  Box,
  Flex,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Title,
} from '@mantine/core';
import { revalidatePath } from 'next/cache';
import AddButton from './AddButton';
import DeleteButton from './DeleteButton';

export default async function HomePage() {
  const photos = await prisma.homePhoto.findMany({
    select: { photo: true },
    orderBy: { createdAt: 'desc' },
  });

  async function handleAdd(photoId: string) {
    'use server';
    await prisma.homePhoto.create({
      data: {
        photoId,
      },
    });
    revalidatePath('/admin/landing-page');
    revalidatePath('/');
  }

  async function handleDelete(photoId: string) {
    'use server';
    await prisma.homePhoto.delete({
      where: {
        photoId,
      },
    });
    revalidatePath('/admin/landing-page');
    revalidatePath('/');
  }

  return (
    <Stack>
      <Paper p="lg" withBorder>
        <Flex justify={'space-between'} align={'center'}>
          <Title fw={'lighter'} size={18} c="gray">
            Landing Page
          </Title>
          <AddButton handleAdd={handleAdd} />
        </Flex>
      </Paper>
      <Paper p="lg" withBorder>
        <SimpleGrid cols={4}>
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
