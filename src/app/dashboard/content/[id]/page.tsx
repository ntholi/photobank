import { DetailsView, FieldView, DetailsViewBody } from '@/components/adease';
import { notFound } from 'next/navigation';
import { getContent, deleteContent } from '@/server/content/actions';
import { getLocation } from '@/server/locations/actions';
import ContentDisplay from '../components/ContentDisplay';
import { ContentDetailsHeader } from '../components/ContentDetailsHeader';
import { Stack } from '@mantine/core';
import { formatDate, formatDateTime } from '@/lib/utils';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContentDetailsPage({ params }: Props) {
  const { id } = await params;
  const content = await getContent(id);

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

          <Stack gap='sm'>
            <FieldView label='Location'>{location?.name ?? '-'}</FieldView>
            <FieldView label='Status'>{content.status}</FieldView>
            <FieldView label='Created'>
              {formatDateTime(content.createdAt)}
            </FieldView>
          </Stack>
        </Stack>
      </DetailsViewBody>
    </DetailsView>
  );
}
