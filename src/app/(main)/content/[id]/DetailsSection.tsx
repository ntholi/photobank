'use client';

import { formatDate } from '@/lib/utils';
import { getContentWithDetails } from '@/server/content/actions';
import { Card, CardBody } from '@heroui/card';
import { User } from '@heroui/user';
import { IoMdPerson } from 'react-icons/io';

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
            name='Anonymous Contributor'
            description='Lesotho Photobank Community'
            avatarProps={{
              src: '',
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
            }}
          />
          <p className='text-xs text-gray-400 mt-3'>
            Help preserve Lesotho's heritage through photography
          </p>
        </CardBody>
      </Card>

      <Card className='shadow-none border border-gray-200'>
        <CardBody className='p-6 space-y-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Details</h3>

          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Type</span>
              <span className='text-sm font-medium text-gray-900 capitalize px-3 py-1 bg-gray-100 rounded-full'>
                {content.type}
              </span>
            </div>

            {content.location && (
              <div className='space-y-2'>
                <span className='text-sm text-gray-600'>Location</span>
                <div className='text-sm font-medium text-gray-900'>
                  {content.location.name}
                  {content.location.address && (
                    <div className='text-xs text-gray-500 mt-1'>
                      {content.location.address}
                    </div>
                  )}
                </div>
              </div>
            )}

            {content.createdAt && (
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Date</span>
                <span className='text-sm font-medium text-gray-900'>
                  {formatDate(content.createdAt)}
                </span>
              </div>
            )}
          </div>

          {content.description && (
            <div className='pt-4 border-t border-gray-100'>
              <h4 className='text-sm font-medium text-gray-900 mb-2'>
                Description
              </h4>
              <p className='text-sm text-gray-700 leading-relaxed'>
                {content.description}
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
}
