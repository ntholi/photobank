import { NextResponse } from 'next/server';
import { getLabels } from './labelService';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const photoUrl = searchParams.get('photoUrl') || '';

    const labels = await getLabels(photoUrl);

    return NextResponse.json({ labels });
}
