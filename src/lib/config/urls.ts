export const imageProcessor = (fileName: string) =>
    `https://ydhxmfgb3m.execute-api.eu-central-1.amazonaws.com/Prod/process-image?filename=${fileName}`;

export const thumbnail = (fileName: string) => {
    const name = fileName.split('.')[0];
    return `https://d3tw6tl1trq98w.cloudfront.net/${name}-thumb.jpg`;
};

export const watermarked = (fileName: string) => {
    const name = fileName.split('.')[0];
    return `https://d3tw6tl1trq98w.cloudfront.net/${name}.webp`;
};
