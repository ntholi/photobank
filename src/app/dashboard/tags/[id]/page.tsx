import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import { getTag, deleteTag } from '@/server/tags/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TagDetails({ params }: Props) {
  const { id } = await params;
  const tag = await getTag(id);

  if (!tag) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        title={'Tag'}
        queryKey={['tags']}
        handleDelete={async () => {
          'use server';
          await deleteTag(id);
        }}
      />
      <DetailsViewBody>
        <FieldView label='Name'>{tag.name}</FieldView>
        <FieldView label='Slug'>{tag.slug}</FieldView>
      </DetailsViewBody>
    </DetailsView>
  );
}
