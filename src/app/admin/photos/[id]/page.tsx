import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import { getPhoto, deletePhoto } from '../actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PhotoDetails({ params }: Props) {
  const { id } = await params;
  const photos = await getPhoto(id);
  
  if (!photos) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader 
        title={'Photo'} 
        queryKey={['photos']}
        handleDelete={async () => {
          'use server';
          await deletePhoto(id);
        }}
      />
      <DetailsViewBody>
        <FieldView label='File Name'>{photos.fileName}</FieldView>
        <FieldView label='Status'>{photos.status}</FieldView>
        <FieldView label='Description'>{photos.description}</FieldView>
        <FieldView label='Location'>{photos.location}</FieldView>
        <FieldView label='User'>{photos.user}</FieldView>
      </DetailsViewBody>
    </DetailsView>
  );
}