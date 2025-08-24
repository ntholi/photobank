'use client';

import { Button } from '@heroui/button';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from '@heroui/drawer';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { useMemo, useState } from 'react';

type Props = {
  rawHtml: string;
  previewChars?: number;
  title?: string;
};

export default function AboutDrawer({
  rawHtml,
  previewChars = 200,
  title = 'About this location',
}: Props) {
  const [open, setOpen] = useState(false);

  const preview = useMemo(() => {
    const text = rawHtml.replace(/<[^>]+>/g, '');
    return text.length > previewChars
      ? text.slice(0, previewChars).trimEnd() + '…'
      : text;
  }, [rawHtml, previewChars]);

  const showReadMore = useMemo(() => {
    const text = rawHtml.replace(/<[^>]+>/g, '');
    return text.length > previewChars;
  }, [rawHtml, previewChars]);

  return (
    <div className='space-y-2'>
      <div className='text-lg leading-relaxed text-gray-700'>{preview}</div>
      {showReadMore && (
        <Button
          color='primary'
          variant='light'
          size='sm'
          onPress={() => setOpen(true)}
        >
          Read more
        </Button>
      )}

      <Drawer isOpen={open} onOpenChange={setOpen} placement='right' size='2xl'>
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className='text-xl font-semibold'>
                {title}
              </DrawerHeader>
              <DrawerBody>
                <ScrollShadow>
                  <div
                    className='prose dark:prose-invert max-w-none'
                    dangerouslySetInnerHTML={{ __html: rawHtml }}
                  />
                </ScrollShadow>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
