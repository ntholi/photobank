import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import {
  getVirtualTour,
  deleteVirtualTour,
} from '@/server/virtual-tours/actions';
import Link from 'next/link';
import { Anchor } from '@mantine/core';
import VirtualTourPreview from './VirtualTourPreview';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function VirtualTourDetails({ params }: Props) {
  const { id } = await params;
  const virtualTour = await getVirtualTour(id);

  if (!virtualTour) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        title={'Virtual Tour'}
        queryKey={['virtual-tours']}
        handleDelete={async () => {
          'use server';
          await deleteVirtualTour(id);
        }}
      />
      <DetailsViewBody>
        <FieldView label='Preview'>
          <VirtualTourPreview url={virtualTour.url} />
        </FieldView>
        <FieldView label='Location'>
          <Anchor
            component={Link}
            href={`/dashboard/locations/${virtualTour.location?.id}`}
          >
            {virtualTour.location?.name}
          </Anchor>
        </FieldView>
      </DetailsViewBody>
    </DetailsView>
  );
}
