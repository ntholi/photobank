import { Photo, User } from '@prisma/client';

export type SessionUser = import('next-auth').User | undefined;
export type PhotoWithUser = Photo & { user: User };

export type CurrentSlideData = {
    data: PhotoWithUser;
    index: number;
};
