import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import { getLocation, deleteLocation } from '@/server/locations/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LocationDetails({ params }: Props) {
  const { id } = await params;
  const location = await getLocation(id);

  if (!location) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        title={'Location'}
        queryKey={['locations']}
        handleDelete={async () => {
          'use server';
          await deleteLocation(id);
        }}
      />
      <DetailsViewBody>
        <FieldView label='Place Id'>{location.placeId}</FieldView>
        <FieldView label='Name'>{location.name}</FieldView>
        <FieldView label='Address'>{location.address}</FieldView>
      </DetailsViewBody>
    </DetailsView>
  );
}
