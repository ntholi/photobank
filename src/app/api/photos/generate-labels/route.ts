import vision from '@google-cloud/vision';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const photoUrl = searchParams.get('photoUrl') || '';
    const options = {
        credentials: require('../../../../../vision-service-account.json'),
        projectId: 'Your Google Cloud Project ID',
    };

    const client = new vision.ImageAnnotatorClient(options);
    const detections = await client.labelDetection(photoUrl);

    const labels = detections.pop()?.labelAnnotations?.map((it) => ({
        name: it.description,
        score: it.score,
    }));

    return NextResponse.json({ labels });
}
