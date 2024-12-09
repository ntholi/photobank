import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Container from '../../base/Container';
import { Content } from '@prisma/client';

type Props = {
  params: {
    slug: string;
  };
};

async function getContent(slug: string): Promise<Content | null> {
  return await prisma.content.findFirst({
    where: { slug },
  });
}

export default async function ContentPage({ params }: Props) {
  const content = await getContent(params.slug);

  if (!content) {
    return notFound();
  }

  return (
    <Container className='py-16'>
      <article className='prose lg:prose-lg mx-auto max-w-3xl'>
        <h1 className='text-3xl font-bold'>{slugToTitle(params.slug)}</h1>
        <div dangerouslySetInnerHTML={{ __html: content.body || '' }} />
      </article>
    </Container>
  );
}

function slugToTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
