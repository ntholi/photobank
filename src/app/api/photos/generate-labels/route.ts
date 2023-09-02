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
    const labels = await client.labelDetection(photoUrl);

    labels.forEach((it) => {
        console.log('->', it);
    });

    return NextResponse.json({ message: 'Hello, World!' });
}
