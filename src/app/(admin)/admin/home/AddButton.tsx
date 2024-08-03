'use client';
import { PhotoWithData } from '@/lib/types';
import {
  Button,
  Modal,
  ScrollArea,
  SimpleGrid,
  TextInput,
  Image,
  Center,
  Loader,
  Stack,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Tag } from '@prisma/client';
import { IconPlus } from '@tabler/icons-react';
import axios from 'axios';
import React, { use, useEffect, useState } from 'react';

export default function AddButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const [filter, setFilter] = React.useState('');
  const [photos, setPhotos] = useState<PhotoWithData[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setPhotos([]);
      try {
        const { data } = await axios.post(
          `/api/photos/search?searchKey=${filter}`,
          tag,
        );
        if (data.photos.length > 0) {
          setPhotos(data.photos as PhotoWithData[]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [filter, tag]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Landing Page Photo"
        size={'xl'}
      >
        <Stack>
          <TextInput
            placeholder="Filter"
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          />
          <ScrollArea h={'70vh'}>
            {loading ? (
              <Center mt={'xl'}>
                <Loader size={30} />
              </Center>
            ) : (
              <SimpleGrid cols={3}>
                {photos.map((it) => (
                  <ActionIcon
                    key={it.id}
                    h={200}
                    w={'100%'}
                    variant="default"
                    p={'sm'}
                  >
                    <Image
                      key={it.id}
                      src={it.url}
                      alt={it.caption || 'Lesotho'}
                      h={'100%'}
                    />
                  </ActionIcon>
                ))}
              </SimpleGrid>
            )}
          </ScrollArea>
        </Stack>
      </Modal>
      <Button
        leftSection={<IconPlus size={'1rem'} />}
        variant="default"
        onClick={open}
      >
        New
      </Button>
    </>
  );
}
