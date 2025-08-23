import React from 'react';
import { notFound } from 'next/navigation';
import { getContentByTagWithTagInfo } from '@/server/content/actions';
import { Card, CardBody } from '@heroui/card';
import { getImageUrl } from '@/lib/utils';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TagPage({ params }: Props) {
  const { id } = await params;
  const result = await getContentByTagWithTagInfo(id);

  if (!result || !result.tag) {
    notFound();
  }

  const { tag, items, totalItems } = result;

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Content tagged with "{tag.name}"
          </h1>
          <p className='text-gray-600'>
            {totalItems} {totalItems === 1 ? 'item' : 'items'} found
          </p>
        </div>

        {items.length === 0 ? (
          <Card className='shadow-none border border-gray-200'>
            <CardBody className='p-8 text-center'>
              <p className='text-gray-600'>No content found for this tag.</p>
            </CardBody>
          </Card>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {items.map((item) => (
              <Card
                key={item.id}
                className='group cursor-pointer shadow-none border border-gray-200 hover:shadow-sm transition-all duration-300'
                onClick={() => (window.location.href = `/content/${item.id}`)}
              >
                <CardBody className='p-0'>
                  <div className='aspect-square overflow-hidden rounded-t-lg'>
                    <img
                      src={getImageUrl(item.thumbnailKey)}
                      alt={item.description || `${item.type} content`}
                      className='w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80'
                      loading='lazy'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/photo_session.svg';
                      }}
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
                    <div className='p-4'>
                      <p className='text-sm text-gray-700 line-clamp-2 group-hover:text-gray-900 transition-colors'>
                        {item.description}
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
