'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  Grid,
  Image,
  Card,
  Group,
  Text,
  MultiSelect,
  TextInput,
  Pagination,
  Stack,
  Center,
  Badge,
  ActionIcon,
  Button,
  Box,
  ScrollArea,
  Skeleton,
  Combobox,
  InputBase,
  useCombobox,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconCheck, IconX, IconPhoto } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { getFilteredContent } from '@/server/content/actions';
import { getAllLocations } from '@/server/locations/actions';
import { getPopularTags } from '@/server/tags/actions';
import { getImageUrl } from '@/lib/utils';
import { content } from '@/db/schema';

export type PickerContentItem = Pick<
  typeof content.$inferSelect,
  | 'id'
  | 'userId'
  | 'type'
  | 'description'
  | 'fileName'
  | 's3Key'
  | 'thumbnailKey'
  | 'watermarkedKey'
  | 'fileSize'
  | 'locationId'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
>;

interface ContentPickerProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (item: PickerContentItem) => void;
  selectedId?: string;
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
  selectedId = '',
  title = 'Select Image',
}: ContentPickerProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [locationId, setLocationId] = useState<string | null>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>(selectedId);
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [debouncedLocationSearch] = useDebouncedValue(locationSearch, 300);

  const locationCombobox = useCombobox({
    onDropdownClose: () => locationCombobox.resetSelectedOption(),
  });

  useEffect(() => {
    setSelected(selectedId);
  }, [selectedId]);

  const { data: locations = [] } = useQuery({
    queryKey: ['locations-picker', debouncedLocationSearch],
    queryFn: () => getAllLocations(debouncedLocationSearch, 50),
    staleTime: 5 * 60 * 1000,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['popular-tags'],
    queryFn: getPopularTags,
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
    placeholderData: (previousData) => previousData,
  });

  const handleSelectItem = useCallback((item: PickerContentItem) => {
    if (item.type === 'image') {
      setSelected(item.id);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (!contentData || !selected) return;

    const selectedItem = contentData.items.find(
      (item: PickerContentItem) => item.id === selected
    );
    if (selectedItem) {
      onSelect(selectedItem);
      onClose();
    }
  }, [contentData, selected, onSelect, onClose]);

  const handleClearFilters = () => {
    setSearch('');
    setLocationId(null);
    setLocationSearch('');
    setTagIds([]);
    setPage(1);
  };

  const locationOptions = locations?.map((loc) => (
    <Combobox.Option value={loc.id} key={loc.id}>
      {loc.name}
    </Combobox.Option>
  ));

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
          <Combobox
            store={locationCombobox}
            onOptionSubmit={(val) => {
              setLocationId(val);
              setPage(1);
              locationCombobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <InputBase
                placeholder='Filter by location'
                value={
                  locationId
                    ? locations?.find((l) => l.id === locationId)?.name || ''
                    : locationSearch
                }
                onChange={(event) => {
                  locationCombobox.openDropdown();
                  locationCombobox.updateSelectedOptionIndex();
                  setLocationSearch(event.currentTarget.value);
                }}
                onClick={() => locationCombobox.openDropdown()}
                onFocus={() => locationCombobox.openDropdown()}
                onBlur={() => {
                  locationCombobox.closeDropdown();
                  setLocationSearch('');
                }}
                rightSection={
                  locationId ? (
                    <ActionIcon
                      size='xs'
                      variant='transparent'
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocationId(null);
                        setLocationSearch('');
                        setPage(1);
                      }}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  ) : null
                }
                style={{ minWidth: 200 }}
              />
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>
                {locations?.length > 0 ? (
                  locationOptions
                ) : (
                  <Combobox.Empty>No locations found</Combobox.Empty>
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
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
            <Button
              variant='subtle'
              color='gray'
              onClick={handleClearFilters}
              leftSection={<IconX size={16} />}
              size='sm'
            >
              Clear filters
            </Button>
          )}
        </Group>

        <ScrollArea h={400}>
          {isLoading ? (
            <ContentPickerSkeleton />
          ) : contentData && contentData.items.length > 0 ? (
            <Grid gutter='sm'>
              {contentData.items.map((item) => {
                const isSelected = selected === item.id;
                const isVideo = item.type === 'video';
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
                        cursor: isVideo ? 'not-allowed' : 'pointer',
                        opacity: isVideo ? 0.6 : 1,
                        borderColor: isSelected
                          ? 'var(--mantine-primary-color-filled)'
                          : undefined,
                        borderWidth: isSelected ? 2 : 1,
                        backgroundColor: isSelected
                          ? 'var(--mantine-primary-color-light)'
                          : undefined,
                        boxShadow: isSelected
                          ? 'var(--mantine-shadow-sm)'
                          : undefined,
                      }}
                      onClick={() => !isVideo && handleSelectItem(item)}
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
                                backgroundColor:
                                  'var(--mantine-primary-color-filled)',
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
                              color='gray'
                            >
                              Video (not selectable)
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
                      opacity: 0.35,
                      color: 'var(--mantine-color-dimmed)',
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
            {selected ? '1 image selected' : 'No image selected'}
          </Text>
          <Group gap='sm'>
            <Button variant='default' onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selected}
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
