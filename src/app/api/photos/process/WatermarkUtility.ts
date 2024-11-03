import sharp, { Metadata, Sharp, Gravity } from 'sharp';

interface RGBA {
  r: number;
  g: number;
  b: number;
  alpha: number;
}

interface TextWatermarkOptions {
  fontSize?: number;
  font?: string;
  rgba?: RGBA;
  gravity?: Gravity;
  padding?: number;
  width?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

class WatermarkUtility {
  private readonly defaultTextOptions: Required<
    Omit<TextWatermarkOptions, 'width'>
  > = {
    fontSize: 160,
    font: 'Arial',
    rgba: { r: 255, g: 255, b: 255, alpha: 0.6 },
    gravity: 'center',
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 3,
    shadowOffsetX: 4,
    shadowOffsetY: 4,
  };

  public async addTextWatermark(
    inputImagePath: Buffer,
    text: string,
    options: TextWatermarkOptions = {},
  ): Promise<Buffer> {
    try {
      const opts = { ...this.defaultTextOptions, ...options };
      const originalMetadata = await sharp(inputImagePath).metadata();

      if (!originalMetadata.width || !originalMetadata.height) {
        throw new Error('Unable to get image dimensions');
      }

      let finalWidth = originalMetadata.width;
      let finalHeight = originalMetadata.height;

      if (options.width) {
        const resizedDimensions = this.calculateResizedDimensions(
          originalMetadata.width,
          originalMetadata.height,
          options.width,
        );
        finalWidth = resizedDimensions.width;
        finalHeight = resizedDimensions.height;

        if (options.fontSize) {
          opts.fontSize = Math.round(
            (options.fontSize * resizedDimensions.width) /
              originalMetadata.width,
          );
        }
      }

      const svgText = this.createWatermarkSvg(
        text,
        { width: finalWidth, height: finalHeight },
        opts,
      );

      return await sharp(inputImagePath)
        .resize(finalWidth, finalHeight, {
          fit: 'contain',
          withoutEnlargement: true,
        })
        .composite([
          {
            input: Buffer.from(svgText),
            gravity: 'center',
          },
        ])
        .toBuffer();
    } catch (error) {
      console.error('Error adding text watermark:', error);
      throw error;
    }
  }

  private calculateResizedDimensions(
    originalWidth: number,
    originalHeight: number,
    targetWidth: number,
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight;
    const width = Math.min(targetWidth, originalWidth);
    const height = Math.round(width / aspectRatio);

    return { width, height };
  }

  private createWatermarkSvg(
    text: string,
    dimensions: { width: number; height: number },
    options: Required<Omit<TextWatermarkOptions, 'width'>>,
  ): string {
    const { width, height } = dimensions;
    const {
      fontSize,
      font,
      rgba,
      shadowColor,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
    } = options;

    return `
      <svg width="${width}" height="${height}">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="${shadowBlur}"/>
            <feOffset dx="${shadowOffsetX}" dy="${shadowOffsetY}" result="offsetblur"/>
            <feFlood flood-color="${shadowColor}"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <style>
          .text { 
            fill: rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.alpha});
            font-size: ${fontSize}px;
            font-family: ${font};
            font-weight: bold;
            dominant-baseline: middle;
            text-anchor: middle;
            filter: url(#shadow);
          }
        </style>
        <text
          x="50%"
          y="50%"
          class="text"
        >${text}</text>
      </svg>`;
  }
}

export default WatermarkUtility;
