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
import AboutSection from './AboutSection';

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
        title={location.name}
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
            <AboutSection
              covers={
                (location as any).coverContents ||
                (location.coverContent ? [location.coverContent] : [])
              }
              aboutHtml={location.about}
            />
          </TabsPanel>

          <TabsPanel value='details' pt='xl'>
            <Stack gap='md'>
              <FieldView label='Place Id'>{location.placeId}</FieldView>
              <FieldView label='Name'>{location.name}</FieldView>
              <FieldView label='Address'>{location.address}</FieldView>
              <FieldView label='Latitude'>{location.latitude}</FieldView>
              <FieldView label='Longitude'>{location.longitude}</FieldView>
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
