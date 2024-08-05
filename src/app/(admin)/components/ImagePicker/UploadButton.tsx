import { PhotoWithData } from '@/lib/types';
import {
  ActionIcon,
  Box,
  Center,
  Divider,
  Flex,
  Image,
  Loader,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Photo } from '@prisma/client';
import { IconPhoto } from '@tabler/icons-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

type Props = {
  handleImageChange: (photo: Photo) => void;
};

export default function UploadButton({ handleImageChange }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [filter, setFilter] = React.useState('');
  const [photos, setPhotos] = useState<PhotoWithData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setPhotos([]);
      try {
        const { data } = await axios.post(
          `/api/photos/search?searchKey=${filter}`,
        );
        if (data.photos.length > 0) {
          setPhotos(data.photos as PhotoWithData[]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [filter]);

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
          <ScrollArea h={'60vh'}>
            {loading ? (
              <Center mt={'xl'}>
                <Loader size={30} />
              </Center>
            ) : (
              <Stack mt={'lg'}>
                <Box>
                  <Text size="0.9rem">Pick a Photo</Text>
                  <Divider mt={'xs'} />
                </Box>
                <SimpleGrid cols={3}>
                  {photos.map((it) => (
                    <ActionIcon
                      key={it.id}
                      h={200}
                      w={'100%'}
                      variant="default"
                      p={'sm'}
                      onClick={() => {
                        handleImageChange(it);
                        close();
                      }}
                    >
                      <Image
                        key={it.id}
                        src={it.url}
                        alt={it.caption || 'Lehakoe'}
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
      <Flex justify="center" align="center" h={'100%'} w={'100%'}>
        <ActionIcon variant="default" size="xl" onClick={open}>
          <IconPhoto />
        </ActionIcon>
      </Flex>
    </>
  );
}
