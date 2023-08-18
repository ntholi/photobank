import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Photo } from '@prisma/client';

type Props = {
    params: {
        id: string;
    };
};

export async function GET(request: Request, { params }: Props) {
    const id = Number(params.id || -1);

    const photo = await prisma.photo.findUnique({
        where: {
            id: id,
        },
    });
    if (!photo) {
        throw new Error(`Photo with id ${id} not found`);
    }
    return NextResponse.json(photo);
}

export async function PUT(request: Request, { params }: Props) {
    const id = Number(params.id || -1);

    if (id < 0) {
        throw new Error(`Invalid id ${id}`);
    }
    const data = (await request.json()) as Photo;
    const photo = await prisma.photo.update({
        where: {
            id: id,
        },
        data: {
            ...data,
        },
    });
    if (!photo) {
        throw new Error(`Photo with id ${id} not found`);
    }
    return NextResponse.json(photo);
}
