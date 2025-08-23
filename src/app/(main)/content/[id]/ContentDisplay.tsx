'use client';

import { content, locations } from '@/db/schema';
import { getImageUrl } from '@/lib/utils';
import { useEffect, useState } from 'react';
import DetailsSection from './DetailsSection';

type Content = typeof content.$inferSelect;
type Location = typeof locations.$inferSelect;

interface ContentDisplayProps {
  content: Content;
  location: Location | null;
}

export function ContentDisplay({ content, location }: ContentDisplayProps) {
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [imageAspectRatio, setImageAspectRatio] = useState<
    'landscape' | 'portrait' | 'square'
  >('square');
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = getImageUrl(content.watermarkedKey);

  useEffect(() => {
    if (content.type === 'image') {
      extractColorsFromImage();
    }
  }, [content.watermarkedKey]);

  const extractColorsFromImage = async () => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const aspectRatio = img.width / img.height;
        setImageAspectRatio(
          aspectRatio > 1.2
            ? 'landscape'
            : aspectRatio < 0.8
              ? 'portrait'
              : 'square'
        );

        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);

        const imageData = ctx.getImageData(0, 0, 100, 100);
        const colors = extractDominantColors(imageData.data, 4);
        setDominantColors(colors);
      };

      img.src = imageUrl;
    } catch (error) {
      console.error('Error extracting colors:', error);
    }
  };

  const extractDominantColors = (
    data: Uint8ClampedArray,
    colorCount: number
  ): string[] => {
    const colorMap = new Map<string, number>();

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const brightness = (r + g + b) / 3;
      if (brightness < 30 || brightness > 240) continue;

      const color = `${r},${g},${b}`;
      colorMap.set(color, (colorMap.get(color) || 0) + 1);
    }

    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, colorCount)
      .map(([color]) => {
        const [r, g, b] = color.split(',').map(Number);
        return `rgb(${r}, ${g}, ${b})`;
      });

    return sortedColors;
  };

  const generateGradient = (colors: string[]): string => {
    if (colors.length === 0)
      return 'linear-gradient(135deg, rgba(245, 245, 245, 0.3) 0%, rgba(232, 232, 232, 0.3) 100%)';

    const baseColors = colors.slice(0, 3);
    const colorStops = baseColors
      .map((color, index) => {
        const percentage = index * (100 / (baseColors.length - 1));
        return `${color.replace('rgb', 'rgba').replace(')', ', 0.15)')} ${percentage}%`;
      })
      .join(', ');

    return `linear-gradient(135deg, ${colorStops})`;
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className='w-full'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='relative'>
              <div
                className='absolute inset-0 rounded-xl pointer-events-none'
                style={{
                  background:
                    dominantColors.length > 0
                      ? generateGradient(dominantColors)
                      : undefined,
                }}
              />

              <div className='relative bg-white rounded-xl shadow-sm overflow-hidden'>
                {content.type === 'image' ? (
                  <img
                    src={imageUrl}
                    alt={content.description || 'Content image'}
                    className={`transition-all duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    } ${
                      imageAspectRatio === 'landscape'
                        ? 'w-full h-auto max-h-[80vh] object-contain'
                        : imageAspectRatio === 'portrait'
                          ? 'h-full w-auto max-w-full max-h-[80vh] object-contain mx-auto'
                          : 'w-full h-auto max-w-[80vw] max-h-[80vh] object-contain mx-auto'
                    }`}
                    loading='eager'
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/photo_session.svg';
                      setImageLoaded(true);
                    }}
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

                {!imageLoaded && content.type === 'image' && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='animate-pulse'>
                      <div className='w-32 h-32 bg-gray-300 rounded-lg'></div>
                    </div>
                  </div>
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
