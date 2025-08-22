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
  watermarkText: string = 'Lehakoe'
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

  // Get the actual dimensions of the resized image buffer
  const resizedMetadata = await sharp(resized).metadata();
  const actualWidth = resizedMetadata.width || newWidth;
  const actualHeight = resizedMetadata.height || newHeight;

  const fontSize = Math.max(
    64,
    Math.floor(Math.min(actualWidth, actualHeight) / 8)
  );

  const watermarkSvg = `
    <svg width="${actualWidth}" height="${actualHeight}">
      <defs>
        <style>
          .watermark {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: ${fontSize}px;
            fill: rgba(255, 255, 255, 0.6);
            stroke: rgba(0, 0, 0, 0.2);
            stroke-width: 0.5px;
            text-anchor: middle;
            dominant-baseline: middle;
            letter-spacing: 0.1em;
            font-weight: bold;
          }
        </style>
      </defs>
      <text x="${actualWidth / 2}" y="${actualHeight / 2}" class="watermark">${watermarkText}</text>
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
    width: finalMetadata.width || actualWidth,
    height: finalMetadata.height || actualHeight,
  };
}

export function isImageFile(contentType: string): boolean {
  return contentType.startsWith('image/');
}
