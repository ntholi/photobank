import { User } from 'next-auth';

export const APP_NAME = 'PhotoBank';

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
        return `/profile/${user.id}`;
    }
    return '#';
};
