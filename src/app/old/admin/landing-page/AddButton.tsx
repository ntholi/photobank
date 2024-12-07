'use client';
import { PhotoWithData } from '@/lib/types';
import {
  Button,
  Modal,
  ScrollArea,
  SimpleGrid,
  TextInput,
  Text,
  Image,
  Center,
  Loader,
  Stack,
  ActionIcon,
  Box,
  Divider,
  Chip,
  Group,
  Flex,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Tag } from '@prisma/client';
import { IconPlus } from '@tabler/icons-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

type AddButtonProps = {
  handleAdd: (photoId: string) => Promise<void>;
};

export default function AddButton({ handleAdd }: AddButtonProps) {
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
          { tagId: tag?.id },
        );
        if (data.length > 0) {
          setPhotos(data as PhotoWithData[]);
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
        title='Landing Page Photo'
        size={'xl'}
      >
        <Stack>
          <TextInput
            placeholder='Filter'
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          />
          <ScrollArea scrollbars='y'>
            <TagSelect setTag={setTag} />
          </ScrollArea>
          <ScrollArea h={'60vh'}>
            {loading ? (
              <Center mt={'xl'}>
                <Loader size={30} />
              </Center>
            ) : (
              <Stack mt={'lg'}>
                <Box>
                  <Text size='0.9rem'>Pick a Photo</Text>
                  <Divider mt={'xs'} />
                </Box>
                <SimpleGrid cols={3}>
                  {photos.map((it) => (
                    <ActionIcon
                      key={it.id}
                      h={200}
                      w={'100%'}
                      variant='default'
                      p={'sm'}
                      onClick={() => {
                        handleAdd(it.id);
                        close();
                      }}
                    >
                      <Image
                        key={it.id}
                        src={it.url}
                        alt={it.description || 'Lehakoe'}
                        h={'100%'}
                      />
                    </ActionIcon>
                  ))}
                </SimpleGrid>
              </Stack>
            )}
          </ScrollArea>
        </Stack>
      </Modal>
      <Button
        leftSection={<IconPlus size={'1rem'} />}
        variant='default'
        onClick={open}
      >
        Add Photo
      </Button>
    </>
  );
}

type TagSelectProps = {
  setTag: React.Dispatch<React.SetStateAction<Tag | null>>;
};

function TagSelect({ setTag }: TagSelectProps) {
  const [data, setData] = useState<Tag[]>([]);

  React.useEffect(() => {
    axios.get('/api/filters').then((res) => {
      if (res.data.filters) {
        setData(res.data.filters);
      }
    });
  }, []);

  return (
    <Chip.Group
      onChange={(it) => {
        setTag(data.find((i) => i.name === it) || null);
      }}
      defaultValue={'All'}
    >
      <Group>
        {data.map((item) => (
          <Chip key={item.id} value={item.name}>
            {item.name}
          </Chip>
        ))}
      </Group>
    </Chip.Group>
  );
}
