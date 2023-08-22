const api = (path: string) => {
    if (process.env.NODE_ENV == 'development') {
        return `http://localhost:3000/api/${path}`;
    }
    return `https://lesothophotobank.vercel.app/api/${path}`;
};

export default api;
