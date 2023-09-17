import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { thumbnail } from '@/lib/config/urls';

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

    const fileName = photo.fileName.split('.')[0];

    return NextResponse.json({
        photo: {
            ...photo,
            url: thumbnail(fileName),
        },
    });
}

export type PhotoData = {
    caption: string;
    location: {
        name: string;
        lat: number;
        lng: number;
    };
};

export async function PUT(request: Request, { params }: Props) {
    const { location, caption } = (await request.json()) as PhotoData;
    const photo = await prisma.photo.update({
        where: {
            id: params.id,
        },
        data: {
            caption: caption,
            status: 'published',
            location: {
                connectOrCreate: {
                    where: {
                        name: location.name,
                    },
                    create: {
                        name: location.name,
                        lat: location.lat,
                        lng: location.lng,
                    },
                },
            },
        },
    });
    return NextResponse.json(photo);
}
