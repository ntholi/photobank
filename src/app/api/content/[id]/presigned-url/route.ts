import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generatePresignedUrl } from '@/lib/aws';
import { contentService } from '@/server/content/service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentId = params.id;
    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const content = await contentService.get(contentId);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    if (!content.s3Key) {
      return NextResponse.json(
        { error: 'No original file available for this content' },
        { status: 404 }
      );
    }

    const presignedUrl = await generatePresignedUrl(content.s3Key, 900);

    return NextResponse.json({
      url: presignedUrl,
      expiresIn: 900,
      fileName: content.fileName,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}
