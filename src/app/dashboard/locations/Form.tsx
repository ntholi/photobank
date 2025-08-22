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
  Alert,
  Tooltip,
  Paper,
} from '@mantine/core';
import { createInsertSchema } from 'drizzle-zod';
import { useRouter } from 'next/navigation';
import { ContentPicker } from '@/components/ContentPicker';
import RichTextField from '@/components/adease/RichTextField';
import {
  IconX,
  IconPhoto,
  IconAlertCircle,
  IconSparkles,
} from '@tabler/icons-react';
import { getImageUrl } from '@/lib/utils';
import { updateLocationDetails } from '@/server/locations/actions';
import { generateTourismPromotion } from '@/lib/titan';

type Location = typeof locations.$inferInsert;
type ContentItem = typeof content.$inferSelect;

type Props = {
  onSubmit: (values: Location) => Promise<Location>;
  defaultValues?: Location;
  defaultCoverContent?: ContentItem | null;
  defaultAbout?: string;
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
  defaultAbout,
  title,
}: Props) {
  const router = useRouter();
  const [showContentPicker, setShowContentPicker] = useState(false);
  const [selectedCoverContent, setSelectedCoverContent] =
    useState<ContentItem | null>(null);
  const [aboutContent, setAboutContent] = useState('');
  const [isGeneratingPromotion, setIsGeneratingPromotion] = useState(false);

  useEffect(() => {
    if (defaultCoverContent) {
      setSelectedCoverContent(defaultCoverContent);
    }
  }, [defaultCoverContent]);

  useEffect(() => {
    if (defaultAbout) {
      setAboutContent(defaultAbout);
    }
  }, [defaultAbout]);

  const handleContentSelect = (item: ContentItem) => {
    setSelectedCoverContent(item);
    setShowContentPicker(false);
  };

  const handleRemoveCoverContent = () => {
    setSelectedCoverContent(null);
  };

  const handleGeneratePromotion = async () => {
    if (!defaultValues?.name) {
      return;
    }

    setIsGeneratingPromotion(true);
    try {
      const promotion = await generateTourismPromotion({
        locationName: defaultValues.name,
        locationAddress: defaultValues.address || undefined,
        locationDescription: aboutContent,
      });

      console.log('Generated tourism promotion:', promotion);

      setAboutContent(promotion);
    } catch (error) {
      console.error('Failed to generate tourism promotion:', error);
    } finally {
      setIsGeneratingPromotion(false);
    }
  };

  const handleFormSubmit = async (values: Location) => {
    const location = await onSubmit(values);

    if (location?.id) {
      await updateLocationDetails(location.id, {
        coverContentId: selectedCoverContent?.id || null,
        about: aboutContent,
      });
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
        p={'xs'}
      >
        {(form) => (
          <Tabs defaultValue='about' keepMounted={false}>
            <Tabs.List>
              <Tabs.Tab value='about'>About</Tabs.Tab>
              <Tabs.Tab value='content'>Cover</Tabs.Tab>
              <Tabs.Tab value='details'>Details</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value='about' pt='xl'>
              <Stack gap='md'>
                <RichTextField
                  label={
                    <Group gap='lg'>
                      <Text fw={500}>About {defaultValues?.name}</Text>
                      <Tooltip label='Use AI to generate tourism promotion'>
                        <ActionIcon
                          variant='gradient'
                          gradient={{ from: 'blue', to: 'green', deg: 90 }}
                          size='sm'
                          onClick={handleGeneratePromotion}
                          loading={isGeneratingPromotion}
                          disabled={!defaultValues?.name}
                        >
                          <IconSparkles size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  }
                  value={aboutContent}
                  onChange={setAboutContent}
                  height={400}
                />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value='content' pt='xl'>
              <Stack gap='md'>
                <Paper withBorder p='md'>
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
                </Paper>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value='details' pt='xl'>
              <Stack gap='md'>
                <Alert
                  variant='light'
                  color='yellow'
                  title='Warning'
                  icon={<IconAlertCircle size={16} />}
                >
                  Please don't update the information below unless you are sure
                  about it.
                </Alert>
                <TextInput
                  label='Place ID'
                  {...form.getInputProps('placeId')}
                />
                <TextInput label='Name' {...form.getInputProps('name')} />
                <TextInput label='Address' {...form.getInputProps('address')} />
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
