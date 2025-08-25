'use client';

import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import { MdLocationOn } from 'react-icons/md';
import { getImageUrl } from '@/lib/utils';
import { content as contentSchema } from '@/db/schema';

type Content = typeof contentSchema.$inferSelect;

export default function CoverContentCard({
  content,
  alt,
}: {
  content: Content | null;
  alt: string;
}) {
  const hasContent = !!content;
  return (
    <Card className='shadow-lg' radius='sm'>
      <CardBody className='p-5'>
        {hasContent && content ? (
          <Image
            src={getImageUrl(content.watermarkedKey)}
            alt={alt}
            className='h-auto max-h-[60vh] w-full object-contain'
            loading='eager'
            radius='lg'
            width={800}
            height={600}
          />
        ) : (
          <div className='flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50'>
            <div className='text-center'>
              <div className='mb-4'>
                <MdLocationOn className='mx-auto h-12 w-12 text-gray-500' />
              </div>
              <p className='text-lg text-gray-600'>No cover photo available</p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
