import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import { getLocationDetail } from '../../location-details/actions';
import { Anchor } from '@mantine/core';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function VirtualTourDetails({ params }: Props) {
  const { id } = await params;
  const item = await getLocationDetail(id);

  if (!item) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        title={'Virtual Tour'}
        queryKey={['location-details']}
      />
      <DetailsViewBody>
        <FieldView label='Location'>{item.location.name}</FieldView>
        <FieldView label='Virtual Tour'>
          {item.tourUrl && (
            <Anchor target='_blank' href={`${item.tourUrl}/index.htm`}>
              {item.tourUrl?.split('/').at(-1)}
            </Anchor>
          )}
        </FieldView>
      </DetailsViewBody>
    </DetailsView>
  );
}
