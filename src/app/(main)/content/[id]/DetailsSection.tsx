'use client';

import NextLink from 'next/link';
import { capitalize, formatDate } from '@/lib/utils';
import { getContentWithDetails } from '@/server/content/actions';
import { Card, CardBody } from '@heroui/card';
import { User } from '@heroui/user';
import { Chip } from '@heroui/chip';
import { IoMdPerson } from 'react-icons/io';
import { Link } from '@heroui/link';
import ActionBar from './ActionBar';

type Content = NonNullable<Awaited<ReturnType<typeof getContentWithDetails>>>;

type Props = {
  content: Content;
};

export default function DetailsSection({ content }: Props) {
  return (
    <>
      <Card className='border-default-200 border shadow-none'>
        <CardBody className='p-6'>
          <h3 className='text-foreground mb-4 text-lg font-semibold'>
            Photographer
          </h3>
          <User
            name={content.user?.name || 'Anonymous Contributor'}
            as={Link}
            href={`/profile/${content.user.id}`}
            description={capitalize(content.user?.role || 'user')}
            avatarProps={{
              src: content.user?.image || '',
              size: 'lg',
              className: 'flex-shrink-0',
              fallback: <IoMdPerson className='text-2xl' />,
              classNames: {
                base: 'bg-default-100 border-2 border-default-200',
              },
            }}
            classNames={{
              name: 'text-sm font-medium text-foreground',
              description: 'text-xs text-default-500',
              base: 'justify-start',
            }}
          />
        </CardBody>
      </Card>
      <ActionBar contentId={content.id} />
      <Card className='border-default-200 border shadow-none'>
        <CardBody className='space-y-4 p-6'>
          <h3 className='text-foreground text-lg font-semibold'>Details</h3>
          <div className='space-y-3'>
            <div className='space-y-2'>
              <span className='text-default-600 text-sm'>Location</span>
              <div>
                {content.location ? (
                  <Link
                    as={NextLink}
                    href={`/locations/${content.location.id}`}
                  >
                    <div>{content.location.name}</div>
                  </Link>
                ) : (
                  <div className='text-default-500 text-sm italic'>
                    Location not set
                  </div>
                )}
              </div>
            </div>

            {content.createdAt && (
              <div className='flex items-center justify-between'>
                <span className='text-default-600 text-sm'>Date Uploaded</span>
                <span className='text-foreground text-sm font-medium'>
                  {formatDate(content.createdAt)}
                </span>
              </div>
            )}
          </div>

          {content.tags && content.tags.length > 0 && (
            <div className='border-default-100 border-t pt-4'>
              <h4 className='text-foreground mb-2 text-sm font-medium'>Tags</h4>
              <div className='flex flex-wrap gap-2'>
                {content.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/?tags=${encodeURIComponent(tag.id)}#gallery`}
                  >
                    <Chip
                      size='sm'
                      variant='flat'
                      className='hover:bg-primary/10 text-primary cursor-pointer'
                    >
                      {tag.name}
                    </Chip>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className='border-default-100 border-t pt-4'>
            <h4 className='text-foreground mb-2 text-sm font-medium'>
              Description
            </h4>
            <p className='text-default-700 text-sm leading-relaxed'>
              {content.description || 'Description not available'}
            </p>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
