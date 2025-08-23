import { getContentWithDetails } from '@/server/content/actions';
import { notFound } from 'next/navigation';
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
    const content = await getContentWithDetails(id);

    if (!content || content.status !== 'published') {
      notFound();
    }

    return (
      <div className='min-h-screen'>
        <ContentDisplay content={content} />
        <SimilarContent contentId={id} />
      </div>
    );
  } catch (error) {
    console.error('Error loading content:', error);
    notFound();
  }
}
