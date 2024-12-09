import { Box } from '@mantine/core';
import { getContent } from '../actions';
import ContentForm from './ContentForm';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function page({ params }: Props) {
  const { slug } = await params;
  const content = await getContent(slug);
  return (
    <Box p={'md'}>
      <ContentForm slug={slug} content={content} />
    </Box>
  );
}
