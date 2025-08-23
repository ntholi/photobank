import { content, locations } from '@/db/schema';
import {
  extractDominantColors,
  generateGradient,
  getDefaultColors,
} from '@/lib/colors';
import { getImageUrl } from '@/lib/utils';
import { Image } from '@heroui/image';
import DetailsSection from './DetailsSection';

type Content = typeof content.$inferSelect;
type Location = typeof locations.$inferSelect;

interface ContentDisplayProps {
  content: Content;
  location: Location | null;
}

export async function ContentDisplay({
  content,
  location,
}: ContentDisplayProps) {
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
        background: generateGradient(dominantColors, 0.15),
      }}
    >
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 bg-background/40 rounded-xl p-0.5'>
            {content.type === 'image' ? (
              <Image
                src={imageUrl}
                alt={content.description || 'Content image'}
                className='w-full h-auto max-h-[75vh] object-contain'
                loading='eager'
                radius='lg'
                width={1000}
                height={1000}
              />
            ) : (
              <video
                src={imageUrl}
                controls
                className='w-full h-auto max-h-[80vh] rounded-lg'
                poster={getImageUrl(content.thumbnailKey)}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          <div className='lg:col-span-1 space-y-6'>
            <DetailsSection content={content} location={location} />
          </div>
        </div>
      </div>
    </div>
  );
}
