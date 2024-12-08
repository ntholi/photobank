import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import { getLocationDetail, deleteLocationDetail } from '../actions';
import { Anchor, Fieldset, Text, Image } from '@mantine/core';
import { thumbnail } from '@/lib/config/urls';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LocationDetailDetails({ params }: Props) {
  const { id } = await params;
  const item = await getLocationDetail(id);

  if (!item) {
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
        <FieldView label='Name'>{item.location.name}</FieldView>
        <FieldView label='Virtual Tour'>
          {item.tourUrl && (
            <Anchor target='_blank' href={`${item.tourUrl}/index.htm`}>
              {item.tourUrl?.split('/').at(-1)}
            </Anchor>
          )}
        </FieldView>
        {item.coverPhoto && (
          <Image
            style={{ maxHeight: '40vh' }}
            src={thumbnail(item.coverPhoto?.fileName)}
          />
        )}
        <Fieldset legend={'About Location'}>
          <Text>{item.about}</Text>
        </Fieldset>
      </DetailsViewBody>
    </DetailsView>
  );
}
