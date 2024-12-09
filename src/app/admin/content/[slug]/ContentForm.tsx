'use client';

import { Form } from '@/components/adease';
import RichTextField from '@/components/RichTextField';
import { Content } from '@prisma/client';
import { saveContent } from '../actions';

type Props = {
  slug: string;
  content: Content | null;
};

export default function ContentForm({ content, slug }: Props) {
  const title = slugToTitle(slug);

  const onSubmit = async (values: Content) => {
    return await saveContent(slug, values);
  };

  return (
    <Form
      title={title}
      action={onSubmit}
      closable={false}
      queryKey={['content', slug]}
      defaultValues={content}
    >
      {(form) => (
        <RichTextField label={title} {...form.getInputProps('body')} />
      )}
    </Form>
  );
}

function slugToTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
