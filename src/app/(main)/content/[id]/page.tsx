import { getContentWithDetails } from '@/server/content/actions';
import { notFound } from 'next/navigation';
import { ContentDisplay } from './ContentDisplay';
import { SimilarContent } from './SimilarContent';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { getImageUrl, stripHtml, shorten, toTitleCase } from '@/lib/utils';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const content = await getContentWithDetails(id);
    if (!content || content.status !== 'published') {
      return {
        title: 'Content not found',
        robots: { index: false, follow: false },
      };
    }

    const url = `${siteConfig.baseUrl}/content/${id}`;
    const imageUrl = getImageUrl(
      content.thumbnailKey || content.watermarkedKey
    );
    const rawTitle =
      content.location?.name || content.description || 'Lehakoe Photo';
    const title = `${toTitleCase(shorten(stripHtml(rawTitle), 60))} | ${siteConfig.name}`;
    const rawDescription = `${content.description || 'Photo'} in ${content.location?.name}, Lesotho`;
    const description = shorten(stripHtml(rawDescription), 160);
    const tagKeywords = (content.tags || []).map((t) => t.tag.name);
    const keywords = Array.from(
      new Set(
        [
          ...tagKeywords,
          content.location?.name || '',
          'Lesotho',
          'Lehakoe Photobank',
          'Tourism',
          'Photography',
        ].filter(Boolean)
      )
    );

    return {
      title,
      description,
      alternates: { canonical: url },
      keywords,
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
      },
      openGraph: {
        type: content.type === 'video' ? 'video.other' : 'article',
        url,
        siteName: siteConfig.name,
        title,
        description,
        publishedTime: content.createdAt?.toISOString(),
        authors: content.user?.name ? [content.user.name] : undefined,
        images: [{ url: imageUrl }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return { title: siteConfig.name };
  }
}

export default async function ContentPage({ params }: Props) {
  const { id } = await params;
  const content = await getContentWithDetails(id);
  if (!content || content.status !== 'published') {
    return notFound();
  }

  return (
    <div className='min-h-screen'>
      <ContentDisplay content={content} />
      <SimilarContent contentId={id} />
    </div>
  );
}
