'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  Grid,
  Image,
  Card,
  Group,
  Text,
  Select,
  MultiSelect,
  TextInput,
  Pagination,
  Stack,
  Loader,
  Center,
  Badge,
  ActionIcon,
  Button,
  Box,
  Checkbox,
  ScrollArea,
  Flex,
  Skeleton,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconCheck, IconX, IconPhoto } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
  getFilteredContent,
  getAllLocations,
  getAllTags,
} from '@/server/content/filterActions';
import { getImageUrl } from '@/lib/utils';
import { content } from '@/db/schema';

type ContentItem = typeof content.$inferSelect;

interface ContentPickerProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (items: ContentItem[]) => void;
  multiple?: boolean;
  selectedIds?: string[];
  title?: string;
}

function ContentPickerSkeleton() {
  return (
    <Grid gutter='sm'>
      {[...Array(12)].map((_, index) => (
        <Grid.Col key={index} span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
          <Card padding='xs' radius='md' withBorder>
            <Card.Section>
              <Skeleton height={150} />
            </Card.Section>
            <Skeleton height={16} mt='xs' width='80%' />
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
}

export function ContentPicker({
  opened,
  onClose,
  onSelect,
  multiple = false,
  selectedIds = [],
  title = 'Select Content',
}: ContentPickerProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [locationId, setLocationId] = useState<string | null>(null);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds));
  const [debouncedSearch] = useDebouncedValue(search, 300);

  useEffect(() => {
    setSelected(new Set(selectedIds));
  }, [selectedIds]);

  const { data: locationsData } = useQuery({
    queryKey: ['locations-picker'],
    queryFn: getAllLocations,
    staleTime: 5 * 60 * 1000,
  });

  const { data: tagsData } = useQuery({
    queryKey: ['tags-picker'],
    queryFn: getAllTags,
    staleTime: 5 * 60 * 1000,
  });

  const { data: contentData, isLoading } = useQuery({
    queryKey: ['filtered-content', page, debouncedSearch, locationId, tagIds],
    queryFn: () =>
      getFilteredContent({
        page,
        size: 12,
        search: debouncedSearch,
        locationId: locationId || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
      }),
    keepPreviousData: true,
  });

  const handleToggleSelect = useCallback(
    (item: ContentItem) => {
      if (multiple) {
        const newSelected = new Set(selected);
        if (newSelected.has(item.id)) {
          newSelected.delete(item.id);
        } else {
          newSelected.add(item.id);
        }
        setSelected(newSelected);
      } else {
        setSelected(new Set([item.id]));
      }
    },
    [multiple, selected]
  );

  const handleConfirm = useCallback(() => {
    if (!contentData) return;

    const selectedItems = contentData.items.filter((item) =>
      selected.has(item.id)
    );
    onSelect(selectedItems);
    onClose();
  }, [contentData, selected, onSelect, onClose]);

  const handleClearFilters = () => {
    setSearch('');
    setLocationId(null);
    setTagIds([]);
    setPage(1);
  };

  const locations = locationsData || [];
  const tags = tagsData || [];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size='xl'
      padding='md'
      closeOnClickOutside={false}
    >
      <Stack gap='md'>
        <Group gap='sm'>
          <TextInput
            placeholder='Search by filename...'
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setPage(1);
            }}
            style={{ flex: 1 }}
          />
          <Select
            placeholder='Filter by location'
            data={locations.map((loc) => ({
              value: loc.id,
              label: loc.name,
            }))}
            value={locationId}
            onChange={(value) => {
              setLocationId(value);
              setPage(1);
            }}
            clearable
            searchable
            style={{ minWidth: 200 }}
          />
          <MultiSelect
            placeholder='Filter by tags'
            data={tags.map((tag) => ({
              value: tag.id,
              label: tag.name,
            }))}
            value={tagIds}
            onChange={(values) => {
              setTagIds(values);
              setPage(1);
            }}
            clearable
            searchable
            style={{ minWidth: 200 }}
          />
          {(search || locationId || tagIds.length > 0) && (
            <ActionIcon
              variant='subtle'
              color='gray'
              onClick={handleClearFilters}
              title='Clear filters'
            >
              <IconX size={16} />
            </ActionIcon>
          )}
        </Group>

        <ScrollArea h={400}>
          {isLoading ? (
            <ContentPickerSkeleton />
          ) : contentData && contentData.items.length > 0 ? (
            <Grid gutter='sm'>
              {contentData.items.map((item) => {
                const isSelected = selected.has(item.id);
                return (
                  <Grid.Col
                    key={item.id}
                    span={{ base: 12, xs: 6, sm: 4, md: 3 }}
                  >
                    <Card
                      padding='xs'
                      radius='md'
                      withBorder
                      style={{
                        cursor: 'pointer',
                        borderColor: isSelected
                          ? 'var(--mantine-color-blue-6)'
                          : undefined,
                        borderWidth: isSelected ? 2 : 1,
                        backgroundColor: isSelected
                          ? 'var(--mantine-color-blue-0)'
                          : undefined,
                        transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected
                          ? '0 4px 16px rgba(0, 0, 0, 0.1)'
                          : undefined,
                      }}
                      onClick={() => handleToggleSelect(item)}
                    >
                      <Card.Section>
                        <Box pos='relative'>
                          <Image
                            src={getImageUrl(item.thumbnailKey)}
                            height={150}
                            alt={item.fileName || 'Content'}
                            fit='cover'
                            fallbackSrc='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWRiNWJkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
                          />
                          {isSelected && (
                            <Box
                              pos='absolute'
                              top={8}
                              right={8}
                              style={{
                                backgroundColor: 'var(--mantine-color-blue-6)',
                                borderRadius: '50%',
                                padding: 2,
                              }}
                            >
                              <IconCheck size={16} color='white' />
                            </Box>
                          )}
                          {item.type === 'video' && (
                            <Badge
                              pos='absolute'
                              bottom={8}
                              left={8}
                              size='sm'
                              variant='filled'
                              color='dark'
                              leftSection={<IconPhoto size={12} />}
                            >
                              Video
                            </Badge>
                          )}
                        </Box>
                      </Card.Section>
                      <Text
                        size='xs'
                        mt='xs'
                        truncate
                        title={item.fileName || undefined}
                      >
                        {item.fileName || 'Untitled'}
                      </Text>
                    </Card>
                  </Grid.Col>
                );
              })}
            </Grid>
          ) : (
            <Center h={300}>
              <Stack align='center' gap='lg'>
                <Box ta='center'>
                  <IconPhoto
                    size={64}
                    style={{
                      opacity: 0.3,
                      color: 'var(--mantine-color-gray-6)',
                    }}
                  />
                </Box>
                <Stack align='center' gap='xs'>
                  <Text size='lg' fw={500} c='dimmed'>
                    No content found
                  </Text>
                  <Text size='sm' c='dimmed' ta='center' maw={300}>
                    Try adjusting your filters or search terms to find content.
                  </Text>
                </Stack>
              </Stack>
            </Center>
          )}
        </ScrollArea>

        {contentData && contentData.totalPages > 1 && (
          <Center>
            <Pagination
              value={page}
              onChange={setPage}
              total={contentData.totalPages}
              size='sm'
            />
          </Center>
        )}

        <Group justify='space-between'>
          <Text size='sm' c='dimmed'>
            {multiple
              ? `${selected.size} item${selected.size !== 1 ? 's' : ''} selected`
              : selected.size > 0
                ? '1 item selected'
                : 'No items selected'}
          </Text>
          <Group gap='sm'>
            <Button variant='default' onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selected.size === 0}
              leftSection={<IconCheck size={16} />}
            >
              Confirm Selection
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
}
