import { Box, Center, Loader } from '@mantine/core';
import { Suspense } from 'react';
import { getContent } from '../actions';
import ContentForm from './ContentForm';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function page({ params }: Props) {
  return (
    <Box p={'md'}>
      <Suspense
        fallback={
          <Center mt={100}>
            <Loader />
          </Center>
        }
      >
        <Content params={params} />
      </Suspense>
    </Box>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const content = await getContent(slug);
  return <ContentForm slug={slug} content={content} />;
}
