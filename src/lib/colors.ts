import { Vibrant } from 'node-vibrant/node';

export async function extractDominantColors(
  imageUrl: string
): Promise<string[]> {
  console.log('Extracting colors from url:', imageUrl);
  try {
    const vibrant = new Vibrant(imageUrl);
    const palette = await vibrant.getPalette();

    const colors: string[] = [];

    const colorTypes = [
      palette.Vibrant,
      palette.LightVibrant,
      palette.DarkVibrant,
      palette.Muted,
      palette.LightMuted,
      palette.DarkMuted,
    ];

    for (const colorType of colorTypes) {
      if (colorType && colors.length < 3) {
        colors.push(colorType.hex);
      }
    }

    return colors;
  } catch (error) {
    console.warn('Vibrant color extraction failed:', error);
    return getDefaultColors();
  }
}

export function getDefaultColors(): string[] {
  return [
    '#6496ff', // Blue
    '#96c8ff', // Light blue
    '#c864ff', // Purple
  ];
}

export function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return `rgba(100, 150, 255, ${alpha})`;
  }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function generateGradient(
  colors: string[],
  opacity: number = 0.25
): string {
  if (colors.length === 0) {
    return `linear-gradient(135deg, ${hexToRgba('#6496ff', opacity)} 0%, ${hexToRgba('#c864ff', opacity)} 100%)`;
  }

  const baseColors = colors.slice(0, 3);
  const colorStops = baseColors
    .map((color, index) => {
      const percentage = Math.round(index * (100 / (baseColors.length - 1)));

      let rgbaColor: string;
      if (color.startsWith('#')) {
        rgbaColor = hexToRgba(color, opacity);
      } else if (color.startsWith('rgb(')) {
        rgbaColor = color
          .replace('rgb(', 'rgba(')
          .replace(')', `, ${opacity})`);
      } else {
        rgbaColor = `rgba(100, 150, 255, ${opacity})`;
      }

      return `${rgbaColor} ${percentage}%`;
    })
    .join(', ');

  return `linear-gradient(135deg, ${colorStops})`;
}
