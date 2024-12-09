import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Container from '../../base/Container';
import { Content } from '@prisma/client';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getContent(slug: string): Promise<Content | null> {
  return await prisma.content.findFirst({
    where: { slug },
  });
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const content = await getContent(slug);

  if (!content) {
    return notFound();
  }

  return (
    <Container className='py-16'>
      <article className='prose lg:prose-lg mx-auto max-w-3xl'>
        <h1 className='mb-2 text-3xl font-bold'>{slugToTitle(slug)}</h1>
        <div dangerouslySetInnerHTML={{ __html: content.body || '' }} />
      </article>
    </Container>
  );
}

function slugToTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
