import vision from '@google-cloud/vision';

type LabelData = {
    name: string;
    score: number;
};
export const getLabels = async (photoUrl: string): Promise<LabelData[]> => {
    const options = {
        credentials: require('../../../../../vision-service-account.json'),
        projectId: 'Your Google Cloud Project ID',
    };

    const client = new vision.ImageAnnotatorClient(options);
    const detections = await client.labelDetection(photoUrl);

    const labels = detections.pop()?.labelAnnotations?.map((it) => {
        return {
            name: it.description,
            score: it.score,
        } as LabelData;
    });

    console.log({labels})

    return labels || [];
};
