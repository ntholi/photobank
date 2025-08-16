import sharp from 'sharp';

export interface ProcessedImage {
  buffer: Buffer;
  contentType: string;
  width: number;
  height: number;
}

export async function createThumbnail(
  imageBuffer: Buffer,
  maxSize: number = 300
): Promise<ProcessedImage> {
  const processed = await sharp(imageBuffer)
    .resize(maxSize, maxSize, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer();

  const metadata = await sharp(processed).metadata();

  return {
    buffer: processed,
    contentType: 'image/webp',
    width: metadata.width || maxSize,
    height: metadata.height || maxSize,
  };
}

export async function createWatermarkedImage(
  imageBuffer: Buffer,
  maxSize: number = 900,
  watermarkText: string = 'Photobank'
): Promise<ProcessedImage> {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  const { width = 1, height = 1 } = metadata;
  const scale = Math.min(maxSize / width, maxSize / height);
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);

  const resized = await image
    .resize(newWidth, newHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer();

  const fontSize = Math.max(24, Math.floor(Math.min(newWidth, newHeight) / 25));

  const watermarkSvg = `
    <svg width="${newWidth}" height="${newHeight}">
      <defs>
        <style>
          .watermark { 
            font-family: Arial, sans-serif; 
            font-size: ${fontSize}px; 
            fill: rgba(255, 255, 255, 0.7); 
            stroke: rgba(0, 0, 0, 0.3); 
            stroke-width: 1px;
            text-anchor: middle;
            dominant-baseline: middle;
          }
        </style>
      </defs>
      <text x="${newWidth / 2}" y="${newHeight / 2}" class="watermark">${watermarkText}</text>
      <text x="${newWidth - 100}" y="${newHeight - 30}" class="watermark" style="font-size: ${Math.floor(fontSize * 0.7)}px;">${watermarkText}</text>
    </svg>
  `;

  const watermarkBuffer = Buffer.from(watermarkSvg);

  const watermarked = await sharp(resized)
    .composite([
      {
        input: watermarkBuffer,
        blend: 'over',
      },
    ])
    .webp({ quality: 90 })
    .toBuffer();

  const finalMetadata = await sharp(watermarked).metadata();

  return {
    buffer: watermarked,
    contentType: 'image/webp',
    width: finalMetadata.width || newWidth,
    height: finalMetadata.height || newHeight,
  };
}

export function isImageFile(contentType: string): boolean {
  return contentType.startsWith('image/');
}
