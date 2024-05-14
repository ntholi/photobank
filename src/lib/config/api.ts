const api = (path: string) => {
  if (process.env.NODE_ENV == 'development') {
    return `http://localhost:3000/api/${path}`;
  }
  return `https://www.lehakoe.org.ls/api/${path}`;
};

export default api;
