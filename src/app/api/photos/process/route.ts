import { NextResponse } from 'next/server';
import { processImage } from './imageService';
import { auth } from '@/auth';
import { z } from 'zod';

const ProcessSchema = z.object({
  fileName: z.string(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fileName } = ProcessSchema.parse(body);

    const processedImages = await processImage(fileName);

    return NextResponse.json({
      success: true,
      data: processedImages,
    });
  } catch (error) {
    console.error('Error in process route:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 },
    );
  }
}
