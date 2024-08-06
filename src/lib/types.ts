import { Photo, User, Location } from '@prisma/client';

export type SessionUser = import('next-auth').User | undefined;

export type PhotoWithData = Photo & { url: string } & { user: User } & {
  location: Location | null;
} & {
  labels: string[];
};

export type CurrentSlideData = {
  data: PhotoWithData;
  index: number;
};
