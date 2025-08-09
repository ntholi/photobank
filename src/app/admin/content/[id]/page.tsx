import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import { getContent, deleteContent } from '@/server/content/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContentDetails({ params }: Props) {
  const { id } = await params;
  const content = await getContent(id);

  if (!content) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        title={'Content'}
        queryKey={['contents']}
        handleDelete={async () => {
          'use server';
          await deleteContent(id);
        }}
      />
      <DetailsViewBody>
        <FieldView label='Type'>{content.type}</FieldView>
        <FieldView label='File Name'>{content.fileName}</FieldView>
        <FieldView label='Location'>{content.location}</FieldView>
        <FieldView label='Status'>{content.status}</FieldView>
      </DetailsViewBody>
    </DetailsView>
  );
}
