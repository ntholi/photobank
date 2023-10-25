import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import axios from 'axios';
import { imageProcessor } from '@/lib/config/urls';

type Label = {
  Name: string;
  Confidence: number;
  Categories: string[];
};

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'admin') {
    return NextResponse.json(
      { error: 'You must be an admin to get all photos' },
      { status: 401 },
    );
  }

  const photos = await prisma.photo.findMany();
  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { fileName } = await request.json();
  if (!session?.user) {
    return NextResponse.json(
      { error: 'You must be logged in to upload a photo' },
      { status: 401 },
    );
  }

  const res = await axios.get(imageProcessor(fileName));
  const { labels: awsLabels } = res.data as { labels: Label[] };
  const labels: { name: string; confidence: number }[] = [];
  awsLabels.forEach((label) => {
    label.Categories.forEach((category) => {
      if (!labels.find((it) => it.name === category)) {
        labels.push({ name: category, confidence: label.Confidence });
      }
    });
  });

  const photo = await prisma.photo.create({
    data: {
      userId: session.user.id,
      fileName: fileName,
      labels: {
        create: labels.map((it) => ({
          confidence: it.confidence,
          label: {
            connectOrCreate: {
              where: {
                name: it.name,
              },
              create: {
                name: it.name,
              },
            },
          },
        })),
      },
    },
  });

  return NextResponse.json({ photo });
}
