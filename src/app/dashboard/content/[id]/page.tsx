import { DetailsView, DetailsViewBody, FieldView } from '@/components/adease';
import {
  deleteContent,
  getContent,
  getContentWithDetails,
} from '@/server/content/actions';
import { getLocation } from '@/server/locations/actions';
import { Anchor, Fieldset, Stack, Text } from '@mantine/core';
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
      <DetailsViewBody>
        <Stack gap='lg'>
          <ContentDisplay content={content} />
          <ContentID contentId={content.id} />
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
          <FieldView label='Contributor'>
            <Anchor
              component={Link}
              href={`/dashboard/users/${content.userId}`}
            >
              {content.user.name}
            </Anchor>
          </FieldView>

          <Fieldset legend='Description'>
            <Text size='sm'>{content.description || '-'}</Text>
          </Fieldset>

          <ContentTags tags={content.tags} />
          <ContentLabels labels={content.labels} />
          <ContentAuditLog contentId={content.id} />
        </Stack>
      </DetailsViewBody>
    </DetailsView>
  );
}
