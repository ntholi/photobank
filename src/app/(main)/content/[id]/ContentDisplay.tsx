import { content, locations } from '@/db/schema';
import {
  extractDominantColors,
  generateGradient,
  getDefaultColors,
} from '@/lib/colors';
import { getImageUrl } from '@/lib/utils';
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
      className='w-full min-h-screen'
      style={{
        background: generateGradient(dominantColors, 0.15),
      }}
    >
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='relative'>
              <div className='relative rounded-xl overflow-hidden'>
                {content.type === 'image' ? (
                  <img
                    src={imageUrl}
                    alt={content.description || 'Content image'}
                    className='w-full h-auto max-h-[80vh] object-contain'
                    loading='eager'
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
            </div>
          </div>

          <div className='lg:col-span-1 space-y-6'>
            <DetailsSection content={content} location={location} />
          </div>
        </div>
      </div>
    </div>
  );
}
