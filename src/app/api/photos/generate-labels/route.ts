import { NextResponse } from 'next/server';
import { getLabels } from './labelService';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const photoUrl = searchParams.get('photoUrl') || '';

    const labels = await getLabels(photoUrl);

    // retry 3 times if no labels found
    if (!labels.length) {
        for (let i = 0; i < 3; i++) {
            const labels = await getLabels(photoUrl);
            if (labels.length) {
                break;
            }
        }
    }

    return NextResponse.json({ labels });
}
