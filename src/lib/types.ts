import { Photo, User } from '@prisma/client';

export type SessionUser = import('next-auth').User | undefined;
export type PhotoWithUser = Photo & { user: User } & { location: Location };

export type CurrentSlideData = {
    data: PhotoWithUser;
    index: number;
};

export type Location = {
    name: string;
    lat: number;
    lng: number;
};

export type Filter = {
    name: string;
    type: 'tag' | 'location';
};
