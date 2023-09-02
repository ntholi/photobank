import vision from '@google-cloud/vision';
import { Label, Photo } from '@prisma/client';

export const getLabels = async (photo: Photo): Promise<Label[]> => {
    const options = {
        credentials: require('../../../../../vision-service-account.json'),
        projectId: 'Your Google Cloud Project ID',
    };

    const client = new vision.ImageAnnotatorClient(options);
    const detections = await client.labelDetection(photo.url);

    const labels = detections.pop()?.labelAnnotations?.map((it) => {
        return {
            score: it.score,
            name: it.description,
            photoId: photo.id,
        } as Label;
    });

    return labels || [];
};
