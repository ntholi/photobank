import React from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { Card, CardBody } from '@heroui/card';
import { getSimilarContent } from '@/server/content/actions';

type ContentItem = {
  id: string;
  type: 'image' | 'video';
  description: string | null;
  fileName: string | null;
  s3Key: string;
  thumbnailKey: string;
  watermarkedKey: string;
  fileSize: number | null;
  locationId: string | null;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  commonLabelsCount?: number;
};

type Props = {
  contentId: string;
};

function ContentItemCard({ item }: { item: ContentItem }) {
  return (
    <Link href={`/content/${item.id}`}>
      <Card className='group cursor-pointer shadow-none border border-default-200 hover:shadow-sm transition-all duration-300 hover:scale-[1.02]'>
        <CardBody className='p-0'>
          <div className='aspect-square overflow-hidden rounded-t-lg relative'>
            <img
              src={getImageUrl(item.thumbnailKey)}
              alt={item.description || `${item.type} content`}
              className='w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80'
              loading='lazy'
            />

            {item.type === 'video' && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-8 h-8 bg-black/60 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-white ml-0.5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {item.description && (
            <div className='p-3'>
              <p className='text-sm text-default-700 line-clamp-2 group-hover:text-default-900 transition-colors'>
                {item.description}
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </Link>
  );
}

export async function SimilarContent({ contentId }: Props) {
  const data = await getSimilarContent(contentId, 8);

  if (!data || data.length === 0) {
    return (
      <div className='w-full py-12'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-default-900 mb-2'>
              Similar Content
            </h2>
            <p className='text-default-600'>
              Discover more content you might like
            </p>
          </div>
          <div className='text-center py-8'>
            <p className='text-default-600'>
              No similar content found. Check back later!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full py-12'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-default-900 mb-2'>
            Similar Content
          </h2>
          <p className='text-default-600'>
            Discover more content you might like
          </p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {data.map((item) => (
            <ContentItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
