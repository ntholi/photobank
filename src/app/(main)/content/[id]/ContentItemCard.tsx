import { content } from '@/db/schema';
import { getImageUrl } from '@/lib/utils';
import { Image } from '@heroui/image';
import Link from 'next/link';

type ContentItem = typeof content.$inferSelect;

export default function ContentItemCard({ item }: { item: ContentItem }) {
  return (
    <Link href={`/content/${item.id}`}>
      <Image
        src={getImageUrl(item.thumbnailKey)}
        alt={item.description || `${item.type} content`}
        className='h-full w-full object-cover'
        height={200}
        width={600}
        loading='lazy'
        isZoomed
        fallbackSrc='/photo_session.svg'
      />

      {item.type === 'video' && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='bg-background/80 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm'>
            <svg
              className='text-foreground ml-0.5 h-4 w-4'
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
    </Link>
  );
}
