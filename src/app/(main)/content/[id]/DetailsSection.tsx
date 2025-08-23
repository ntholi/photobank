'use client';

import NextLink from 'next/link';
import { capitalize, formatDate } from '@/lib/utils';
import { getContentWithDetails } from '@/server/content/actions';
import { Card, CardBody } from '@heroui/card';
import { User } from '@heroui/user';
import { Chip } from '@heroui/chip';
import { IoMdPerson } from 'react-icons/io';
import { Link } from '@heroui/link';

type Content = NonNullable<Awaited<ReturnType<typeof getContentWithDetails>>>;

type Props = {
  content: Content;
};

export default function DetailsSection({ content }: Props) {
  return (
    <>
      <Card className='shadow-none border border-gray-200'>
        <CardBody className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Photographer
          </h3>
          <User
            name={content.user?.name || 'Anonymous Contributor'}
            description={capitalize(content.user?.role || 'user')}
            avatarProps={{
              src: content.user?.image || '',
              size: 'lg',
              className: 'flex-shrink-0',
              fallback: <IoMdPerson className='text-2xl' />,
              classNames: {
                base: 'bg-gray-100 border-2 border-gray-200',
              },
            }}
            classNames={{
              name: 'text-sm font-medium text-gray-900',
              description: 'text-xs text-gray-500',
              base: 'justify-start',
            }}
          />
          <p className='text-xs text-gray-400 mt-3'>
            {content.user?.bio || 'Bio not available'}
          </p>
        </CardBody>
      </Card>

      <Card className='shadow-none border border-gray-200'>
        <CardBody className='p-6 space-y-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Details</h3>

          <div className='space-y-3'>
            <div className='space-y-2'>
              <span className='text-sm text-gray-600'>Location</span>
              <div>
                {content.location ? (
                  <Link
                    as={NextLink}
                    href={`/locations/${content.location.id}`}
                  >
                    <div>{content.location.name}</div>
                  </Link>
                ) : (
                  <div className='text-sm text-gray-500 italic'>
                    Location not set
                  </div>
                )}
              </div>
            </div>

            {content.createdAt && (
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Date Uploaded</span>
                <span className='text-sm font-medium text-gray-900'>
                  {formatDate(content.createdAt)}
                </span>
              </div>
            )}
          </div>

          {content.tags && content.tags.length > 0 && (
            <div className='pt-4 border-t border-gray-100'>
              <h4 className='text-sm font-medium text-gray-900 mb-2'>Tags</h4>
              <div className='flex flex-wrap gap-2'>
                {content.tags.map(({ tag }) => (
                  <Link key={tag.id} href={`/tags/${tag.id}`}>
                    <Chip
                      size='sm'
                      variant='flat'
                      className='cursor-pointer hover:bg-blue-100 text-blue-600'
                    >
                      {tag.name}
                    </Chip>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className='pt-4 border-t border-gray-100'>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>
              Description
            </h4>
            <p className='text-sm text-gray-700 leading-relaxed'>
              {content.description || 'Description not available'}
            </p>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
