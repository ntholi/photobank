'use client';

import { useState, useEffect } from 'react';
import { locations, content } from '@/db/schema';
import { Form } from '@/components/adease';
import {
  TextInput,
  Tabs,
  Stack,
  Button,
  Group,
  Card,
  Text,
  Box,
  ActionIcon,
  Image,
} from '@mantine/core';
import { createInsertSchema } from 'drizzle-zod';
import { useRouter } from 'next/navigation';
import { ContentPicker } from '@/components/ContentPicker';
import { IconX, IconPhoto } from '@tabler/icons-react';
import { getImageUrl } from '@/lib/utils';
import { updateLocationCoverContent } from '@/server/locations/actions';

type Location = typeof locations.$inferInsert;
type ContentItem = typeof content.$inferSelect;

type Props = {
  onSubmit: (values: Location) => Promise<Location>;
  defaultValues?: Location;
  defaultCoverContent?: ContentItem | null;
  onSuccess?: (value: Location) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>
  ) => void;
  title?: string;
};

export default function LocationForm({
  onSubmit,
  defaultValues,
  defaultCoverContent,
  title,
}: Props) {
  const router = useRouter();
  const [showContentPicker, setShowContentPicker] = useState(false);
  const [selectedCoverContent, setSelectedCoverContent] =
    useState<ContentItem | null>(null);

  useEffect(() => {
    if (defaultCoverContent) {
      setSelectedCoverContent(defaultCoverContent);
    }
  }, [defaultCoverContent]);

  const handleContentSelect = (item: ContentItem) => {
    setSelectedCoverContent(item);
    setShowContentPicker(false);
  };

  const handleRemoveCoverContent = () => {
    setSelectedCoverContent(null);
  };

  const handleFormSubmit = async (values: Location) => {
    const location = await onSubmit(values);

    if (location?.id) {
      await updateLocationCoverContent(
        location.id,
        selectedCoverContent?.id || null
      );
    }

    return location;
  };

  return (
    <>
      <Form
        title={title}
        action={handleFormSubmit}
        queryKey={['locations']}
        schema={createInsertSchema(locations)}
        defaultValues={defaultValues}
        onSuccess={({ id }) => {
          router.push(`/dashboard/locations/${id}`);
        }}
      >
        {(form) => (
          <Tabs defaultValue='details' keepMounted={false}>
            <Tabs.List>
              <Tabs.Tab value='details'>Location Details</Tabs.Tab>
              <Tabs.Tab value='content'>Cover Content</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value='details' pt='xl'>
              <Stack gap='md'>
                <TextInput
                  label='Place ID'
                  {...form.getInputProps('placeId')}
                />
                <TextInput label='Name' {...form.getInputProps('name')} />
                <TextInput label='Address' {...form.getInputProps('address')} />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value='content' pt='xl'>
              <Stack gap='md'>
                <Card withBorder padding='md'>
                  <Group justify='space-between' mb='md'>
                    <Text size='lg' fw={500}>
                      Cover Content
                    </Text>
                    <Button
                      variant='light'
                      onClick={() => setShowContentPicker(true)}
                      leftSection={<IconPhoto size={16} />}
                    >
                      {selectedCoverContent ? 'Change Cover' : 'Select Cover'}
                    </Button>
                  </Group>

                  {selectedCoverContent ? (
                    <Card withBorder padding='xs' radius='md'>
                      <Group wrap='nowrap'>
                        <Box pos='relative'>
                          <Image
                            src={getImageUrl(selectedCoverContent.thumbnailKey)}
                            height={80}
                            width={80}
                            fit='cover'
                            radius='md'
                            alt={
                              selectedCoverContent.fileName || 'Cover content'
                            }
                          />
                        </Box>
                        <Box style={{ flex: 1 }}>
                          <Text size='sm' fw={500} lineClamp={1}>
                            {selectedCoverContent.fileName || 'Untitled'}
                          </Text>
                          <Text size='xs' c='dimmed' mt={4}>
                            Type: {selectedCoverContent.type}
                          </Text>
                          <Text size='xs' c='dimmed'>
                            Status: {selectedCoverContent.status}
                          </Text>
                        </Box>
                        <ActionIcon
                          variant='subtle'
                          color='red'
                          onClick={handleRemoveCoverContent}
                          size='sm'
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      </Group>
                    </Card>
                  ) : (
                    <Card withBorder padding='xl' radius='md'>
                      <Stack align='center' gap='sm'>
                        <IconPhoto size={48} style={{ opacity: 0.3 }} />
                        <Text size='lg' c='dimmed' ta='center'>
                          No cover content selected
                        </Text>
                        <Text size='sm' c='dimmed' ta='center'>
                          Select an image or video to use as cover content for
                          this location
                        </Text>
                      </Stack>
                    </Card>
                  )}
                </Card>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        )}
      </Form>

      <ContentPicker
        opened={showContentPicker}
        onClose={() => setShowContentPicker(false)}
        onSelect={handleContentSelect}
        title='Select Cover Content'
      />
    </>
  );
}
