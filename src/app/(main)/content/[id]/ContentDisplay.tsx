'use client';

import React, { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/utils';
import { User } from '@heroui/user';
import { Card, CardBody } from '@heroui/card';
import { IoMdPerson } from 'react-icons/io';

interface Content {
  id: string;
  type: 'image' | 'video';
  description?: string | null;
  watermarkedKey: string;
  thumbnailKey: string;
  createdAt: Date | null;
}

interface Location {
  id: string;
  name: string;
  address?: string | null;
}

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

      // Skip very dark and very light colors
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
        // Add transparency to make the gradient subtle
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
              {/* Gradient overlay container */}
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
            {/* Photographer Card */}
            <Card className='shadow-none border border-gray-200'>
              <CardBody className='p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Photographer
                </h3>
                <User
                  name='Anonymous Contributor'
                  description='Lesotho Photobank Community'
                  avatarProps={{
                    src: '', // No avatar for anonymous users
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

            {/* Content Details Card */}
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

                  {location && (
                    <div className='space-y-2'>
                      <span className='text-sm text-gray-600'>Location</span>
                      <div className='text-sm font-medium text-gray-900'>
                        {location.name}
                        {location.address && (
                          <div className='text-xs text-gray-500 mt-1'>
                            {location.address}
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
          </div>
        </div>
      </div>
    </div>
  );
}
