export const APP_NAME = 'PhotoBank';

export const constants = {
    UPLOAD_FOLDER: 'uploads',
};

export const api = (path: string) => {
    if (process.env.NODE_ENV == 'development') {
        return `http://localhost:3000/api/${path}`;
    }
    throw new Error('Did not set api url in production');
};
