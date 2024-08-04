import { User } from 'next-auth';

export const APP_NAME = 'Lehakoe';

export const constants = {
  UPLOAD_FOLDER: 'uploads',
};

export enum GalleryType {
  UPLOADS = 'uploads',
  PURCHASED = 'purchased',
  SAVED = 'saved',
}

export const profilePath = (user?: User | null) => {
  if (user) {
    return `/users/${user.id}`;
  }
  return '#';
};

export const LOCATION_BOUNDS = {
  north: -28.572872,
  south: -30.668418,
  east: 29.465229,
  west: 27.011223,
};
