export const imageProcessor = (
  fileName: string,
  watermarked: boolean = true,
) => {
  const queryParams = new URLSearchParams({
    filename: fileName,
  });
  queryParams.append('add-watermark', watermarked ? 'true' : 'false');

  const url = new URL(process.env.IMAGE_PROCESSOR_URL || '');
  url.search = queryParams.toString();
  return url.toString();
};

export const thumbnail = (fileName: string) => {
  const name = fileName.split('.')[0];
  return `https://d3tw6tl1trq98w.cloudfront.net/${name}-thumb.jpg`;
};

export const watermarked = (fileName: string) => {
  const name = fileName.split('.')[0];
  return `https://d3tw6tl1trq98w.cloudfront.net/${name}.webp`;
};
