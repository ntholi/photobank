import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import { getContent, deleteContent } from '@/server/content/actions';
import { getLocation } from '@/server/locations/actions';
import ContentDisplay from '../ContentDisplay';
import { Stack } from '@mantine/core';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContentDetails({ params }: Props) {
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
      <DetailsViewHeader
        title={'Content'}
        queryKey={['content']}
        handleDelete={async () => {
          'use server';
          await deleteContent(id);
        }}
      />
      <DetailsViewBody>
        <Stack gap='lg'>
          <ContentDisplay content={content} />

          <div>
            <FieldView label='Type'>{content.type}</FieldView>
            <FieldView label='File Name'>{content.fileName}</FieldView>
            <FieldView label='Location'>{location?.name ?? '-'}</FieldView>
            <FieldView label='Status'>{content.status}</FieldView>
            {content.fileSize && (
              <FieldView label='File Size'>
                {(content.fileSize / 1024 / 1024).toFixed(2)} MB
              </FieldView>
            )}
            {content.createdAt && (
              <FieldView label='Created'>
                {new Date(content.createdAt).toLocaleDateString()}
              </FieldView>
            )}
          </div>
        </Stack>
      </DetailsViewBody>
    </DetailsView>
  );
}
