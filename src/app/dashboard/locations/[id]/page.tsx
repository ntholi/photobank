import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import {
  deleteLocation,
  getLocationWithCoverContent,
} from '@/server/locations/actions';
import {
  Tabs,
  Stack,
  Group,
  Text,
  Card,
  Image,
  Box,
  TabsList,
  TabsTab,
  TabsPanel,
} from '@mantine/core';
import { getImageUrl } from '@/lib/utils';
import LocationContent from './LocationContent';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LocationDetails({ params }: Props) {
  const { id } = await params;
  const location = await getLocationWithCoverContent(id);

  if (!location) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        title={'Location'}
        queryKey={['locations']}
        handleDelete={async () => {
          'use server';
          await deleteLocation(id);
        }}
      />
      <DetailsViewBody>
        <Tabs defaultValue={'about'} keepMounted={false}>
          <TabsList>
            <TabsTab value='about'>About</TabsTab>
            <TabsTab value='content'>Content</TabsTab>
            <TabsTab value='details'>Details</TabsTab>
          </TabsList>

          <TabsPanel value='about' pt='xl'>
            <Stack gap='md'>
              <Group align='flex-start' gap='lg' wrap='nowrap'>
                {location.coverContent ? (
                  <Card withBorder padding='xs' radius='md'>
                    <Image
                      src={getImageUrl(
                        location.coverContent.thumbnailKey ||
                          location.coverContent.s3Key
                      )}
                      height={180}
                      width={180}
                      fit='cover'
                      radius='md'
                      alt={location.coverContent.fileName || 'Cover content'}
                    />
                  </Card>
                ) : null}
                <Box style={{ flex: 1 }}>
                  {location.about ? (
                    <Box dangerouslySetInnerHTML={{ __html: location.about }} />
                  ) : (
                    <Text size='sm' c='dimmed'>
                      No information available.
                    </Text>
                  )}
                </Box>
              </Group>
            </Stack>
          </TabsPanel>

          <TabsPanel value='details' pt='xl'>
            <Stack gap='md'>
              <FieldView label='Place Id'>{location.placeId}</FieldView>
              <FieldView label='Name'>{location.name}</FieldView>
              <FieldView label='Address'>{location.address}</FieldView>
            </Stack>
          </TabsPanel>

          <TabsPanel value='content' pt='xl'>
            <LocationContent locationId={location.id} />
          </TabsPanel>
        </Tabs>
      </DetailsViewBody>
    </DetailsView>
  );
}
