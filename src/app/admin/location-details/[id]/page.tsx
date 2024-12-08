import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import { getLocationDetail, deleteLocationDetail } from '../actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LocationDetailDetails({ params }: Props) {
  const { id } = await params;
  const locationDetails = await getLocationDetail(id);

  if (!locationDetails) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        title={'Location'}
        queryKey={['location-details']}
        handleDelete={async () => {
          'use server';
          await deleteLocationDetail(id);
        }}
      />
      <DetailsViewBody>
        <FieldView label='Location'>{locationDetails.location.name}</FieldView>
        <FieldView label='Cover Photo'>
          {locationDetails.coverPhoto?.fileName}
        </FieldView>
        <FieldView label='About'>{locationDetails.about}</FieldView>
        <FieldView label='Tour Url'>{locationDetails.tourUrl}</FieldView>
      </DetailsViewBody>
    </DetailsView>
  );
}
