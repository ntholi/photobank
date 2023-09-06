import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Photo } from '@prisma/client';
import { PhotoWithData } from '@/lib/types';

type Props = {
    params: {
        id: string;
    };
};

export async function GET(request: Request, { params }: Props) {
    const photo = await prisma.photo.findUnique({
        where: {
            id: params.id,
        },
    });
    if (!photo) {
        throw new Error(`Photo with id ${params.id} not found`);
    }
    return NextResponse.json(photo);
}

export type PhotoData = {
    caption: string;
    description: string;
    location: {
        name: string;
        lat: number;
        lng: number;
    };
    photoUrl: string;
    labels: {
        name: string;
        score: number;
    }[];
};

export async function PUT(request: Request, { params }: Props) {
    const data = (await request.json()) as PhotoData;
    const photo = await prisma.photo.update({
        where: {
            id: params.id,
        },
        data: {
            caption: data.caption,
            status: 'published',
            location: {
                connectOrCreate: {
                    where: {
                        name: data.location.name,
                    },
                    create: {
                        name: data.location.name,
                        lat: data.location.lat,
                        lng: data.location.lng,
                    },
                },
            },
            labels: {
                create: data.labels.map((it) => ({
                    score: it.score,
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
    return NextResponse.json(photo);
}
