import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import { getTag, deleteTag } from '../actions';
import { Fieldset, List, ListItem } from '@mantine/core';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TagDetails({ params }: Props) {
  const { id } = await params;
  const tag = await getTag(Number(id));

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
          await deleteTag(Number(id));
        }}
      />
      <DetailsViewBody>
        <FieldView label='Name'>{tag.name}</FieldView>
        <Fieldset legend='Labels'>
          <List type='ordered' mt={'sm'}>
            {tag.labels.map((it) => (
              <ListItem>{it}</ListItem>
            ))}
          </List>
        </Fieldset>
      </DetailsViewBody>
    </DetailsView>
  );
}
