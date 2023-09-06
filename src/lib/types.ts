import { Label, Photo, User } from '@prisma/client';

export type SessionUser = import('next-auth').User | undefined;
export type PhotoWithData = Photo & { url: string } & { user: User } & {
    location: Location;
} & {
    labels: Label[];
};

export type CurrentSlideData = {
    data: PhotoWithData;
    index: number;
};

export type Location = {
    name: string;
    lat: number;
    lng: number;
};
