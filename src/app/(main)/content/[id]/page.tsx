import React from 'react';
import { getContent, getSimilarContent } from '@/server/content/actions';
import { getLocation } from '@/server/locations/actions';
import { notFound } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';
import { ContentDisplay } from './ContentDisplay';
import { SimilarContent } from './SimilarContent';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ContentPage({ params }: Props) {
  const { id } = await params;

  try {
    const content = await getContent(id);

    if (!content || content.status !== 'published') {
      notFound();
    }

    let location = null;
    if (content.locationId) {
      location = await getLocation(content.locationId);
    }

    const similarContent = await getSimilarContent(id, 8);

    return (
      <div className='min-h-screen'>
        <ContentDisplay content={content} location={location} />
        <SimilarContent items={similarContent} />
      </div>
    );
  } catch (error) {
    console.error('Error loading content:', error);
    notFound();
  }
}
