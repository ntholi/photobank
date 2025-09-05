import {
  extractDominantColors,
  generateGradient,
  getDefaultColors,
} from '@/lib/colors';
import { getImageUrl } from '@/lib/utils';
import { getContentWithDetails } from '@/server/content/actions';
import { Image } from '@heroui/image';
import DetailsSection from './DetailsSection';
import SaveContentButton from './SaveContentButton';

type Content = NonNullable<Awaited<ReturnType<typeof getContentWithDetails>>>;

interface Props {
  content: Content;
}

export async function ContentDisplay({ content }: Props) {
  const imageUrl = getImageUrl(content.watermarkedKey);

  async function getDominantColors(): Promise<string[]> {
    try {
      const url = getImageUrl(content.thumbnailKey || '');

      if (!url) {
        return getDefaultColors();
      }

      const colors = await extractDominantColors(url);
      return colors;
    } catch (error) {
      console.warn('Color extraction failed, using defaults:', error);
      return getDefaultColors();
    }
  }

  const dominantColors = await getDominantColors();

  return (
    <div
      className='w-full'
      style={{
        background: generateGradient(dominantColors, 0.2),
      }}
    >
      <div className='mx-auto max-w-7xl px-4 py-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='rounded-xl p-0.5 lg:col-span-2'>
            {content.type === 'image' ? (
              <Image
                src={imageUrl}
                alt={content.description || 'Content image'}
                className='h-auto max-h-[75vh] w-full object-contain'
                loading='eager'
                radius='lg'
                width={1000}
                height={1000}
              />
            ) : (
              <video
                src={imageUrl}
                controls
                className='h-auto max-h-[80vh] w-full rounded-lg'
                poster={getImageUrl(content.thumbnailKey)}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          <div className='space-y-4 lg:col-span-1'>
            <DetailsSection content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
