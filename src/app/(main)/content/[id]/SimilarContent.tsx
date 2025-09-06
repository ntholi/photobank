import { getSimilarContent } from '@/server/content/actions';
import ContentItemCard from './ContentItemCard';

export type Props = {
  contentId: string;
};

export async function SimilarContent({ contentId }: Props) {
  const data = await getSimilarContent(contentId, 8);

  if (!data || data.length === 0) {
    return (
      <div className='w-full py-12'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-8'>
            <h2 className='text-default-900 mb-2 text-2xl font-bold'>
              Similar Content
            </h2>
            <p className='text-default-600'>
              Discover more content you might like
            </p>
          </div>
          <div className='py-8 text-center'>
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
      <div className='mx-auto max-w-7xl px-4'>
        <div className='mb-8'>
          <h2 className='text-default-900 mb-2 text-2xl font-bold'>
            Similar Content
          </h2>
          <p className='text-default-600'>
            Discover more content you might like
          </p>
        </div>

        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
          {data.map((item) => (
            <ContentItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
