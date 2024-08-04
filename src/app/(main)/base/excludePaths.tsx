export const excludePaths = ['/users', '/signup', '/login', '/signin'];

export const isAppPath = (pathname: string) => {
  const name = pathname.split('/')[1];
  return pathname === '/' || excludePaths.includes(name.replace('/', ''));
};
