import { content as contentSchema, locations } from '@/db/schema';

import {
  getDefaultColors,
  generateGradient,
  extractDominantColors,
} from '@/lib/colors';
import { getImageUrl } from '@/lib/utils';
import LocationHeroDisplay from './LocationHeroDisplay';

type Location = typeof locations.$inferSelect;
type Content = typeof contentSchema.$inferSelect;

interface ImageWithColors {
  content: Content;
  dominantColors: string[];
  gradient: string;
}

interface Props {
  location: Location & {
    coverContent: Content | null;
    coverContents?: Content[];
    about: string | null;
    virtualTourUrl?: string | null;
  };
}

export async function LocationHero({ location }: Props) {
  const contents =
    location.coverContents ??
    (location.coverContent ? [location.coverContent] : []);

  async function getImageWithColors(
    content: Content,
  ): Promise<ImageWithColors> {
    try {
      if (!content.thumbnailKey) {
        const defaultColors = getDefaultColors();
        return {
          content,
          dominantColors: defaultColors,
          gradient: generateGradient(defaultColors, 0.2),
        };
      }

      const url = getImageUrl(content.thumbnailKey);
      const colors = await extractDominantColors(url);
      return {
        content,
        dominantColors: colors,
        gradient: generateGradient(colors, 0.2),
      };
    } catch (error) {
      console.warn('Color extraction failed for content:', content.id, error);
      const defaultColors = getDefaultColors();
      return {
        content,
        dominantColors: defaultColors,
        gradient: generateGradient(defaultColors, 0.2),
      };
    }
  }

  const images: ImageWithColors[] = await Promise.all(
    contents.map((content) => getImageWithColors(content)),
  );

  return <LocationHeroDisplay images={images} location={location} />;
}
