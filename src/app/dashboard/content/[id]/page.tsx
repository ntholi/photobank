import { DetailsView, DetailsViewBody, FieldView } from '@/components/adease';
import { deleteContent, getContentWithDetails } from '@/server/content/actions';
import { getLocation } from '@/server/locations/actions';
import {
  Anchor,
  Fieldset,
  Grid,
  Paper,
  Stack,
  Tabs,
  Text,
  Title,
  Divider,
  Group,
  Box,
  TabsList,
  TabsTab,
  TabsPanel,
  GridCol,
} from '@mantine/core';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentDetailsHeader } from '../components/ContentDetailsHeader';
import ContentDisplay from '../components/ContentDisplay';
import { ContentLabels } from '../components/ContentLabels';
import { ContentTags } from '../components/ContentTags';
import { ContentAuditLog } from '../components/ContentAuditLog';
import ContentID from './ContentID';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContentDetailsPage({ params }: Props) {
  const { id } = await params;
  const content = await getContentWithDetails(id);

  if (!content) {
    return notFound();
  }

  const location = content.locationId
    ? await getLocation(content.locationId)
    : undefined;

  return (
    <DetailsView>
      <ContentDetailsHeader
        title={'Content'}
        status={content.status}
        queryKey={['content']}
        handleDelete={async () => {
          'use server';
          await deleteContent(id);
        }}
      />
      <DetailsViewBody p={'xs'}>
        <Tabs defaultValue='overview' keepMounted={false} variant='outline'>
          <TabsList>
            <TabsTab value='overview'>Overview</TabsTab>
            <TabsTab value='metadata'>Metadata</TabsTab>
            <TabsTab value='audit'>Audit Log</TabsTab>
          </TabsList>
          <TabsPanel value='overview' pt='md'>
            <Stack gap='md'>
              <ContentDisplay content={content} />
              <Paper withBorder p='md'>
                <Stack gap='sm'>
                  <Group justify='space-between'>
                    <Title order={5}>Basic Info</Title>
                    <ContentID contentId={content.id} />
                  </Group>
                  <FieldView label='Contributor'>
                    <Anchor
                      component={Link}
                      href={`/dashboard/users/${content.userId}`}
                    >
                      {content.user.name}
                    </Anchor>
                  </FieldView>
                  <FieldView label='Location'>
                    {location ? (
                      <Anchor
                        component={Link}
                        href={`/dashboard/locations/${location.id}`}
                      >
                        {location.name}
                      </Anchor>
                    ) : (
                      '-'
                    )}
                  </FieldView>
                </Stack>
              </Paper>
              <Paper withBorder p='md'>
                <Stack gap='sm'>
                  <Title order={5}>Description</Title>
                  <Text size='sm'>{content.description || '-'}</Text>
                </Stack>
              </Paper>
            </Stack>
          </TabsPanel>
          <TabsPanel value='metadata' pt='md'>
            <Stack gap='md'>
              <Paper withBorder p='md'>
                <Stack gap='sm'>
                  <Title order={5}>Classification</Title>
                  <ContentTags tags={content.tags} />
                  <Divider />
                  <ContentLabels labels={content.labels} />
                </Stack>
              </Paper>
              <Paper withBorder p='md'>
                <Stack gap='sm'>
                  <Title order={5}>Technical</Title>
                  <FieldView label='File Name'>
                    <Text size='sm'>{content.fileName || '-'}</Text>
                  </FieldView>
                  <FieldView label='File Size'>
                    <Text size='sm'>
                      {content.fileSize
                        ? `${(content.fileSize / 1024 / 1024).toFixed(2)} MB`
                        : '-'}
                    </Text>
                  </FieldView>
                  <FieldView label='Type'>
                    <Text size='sm'>{content.type}</Text>
                  </FieldView>
                </Stack>
              </Paper>
            </Stack>
          </TabsPanel>
          <TabsPanel value='audit' pt='md'>
            <ContentAuditLog contentId={content.id} />
          </TabsPanel>
        </Tabs>
      </DetailsViewBody>
    </DetailsView>
  );
}
