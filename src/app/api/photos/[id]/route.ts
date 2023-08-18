import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
