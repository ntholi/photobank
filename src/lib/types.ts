import { Photo, User } from '@prisma/client';

type SessionUser = import('next-auth').User | undefined;
export type PhotoWithUser = Photo & { user: User };

export type Data = {
    img: string;
    title: string;
    description: string;
    location: string;
};

export type CurrentSlideData = {
    data: Data;
    index: number;
};
