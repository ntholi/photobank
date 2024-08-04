export const excludePaths = ['/users', '/signup', '/login', '/signin'];

export const isExcludePath = (pathname: string) => {
  return excludePaths.some((path) => pathname.includes(path));
};
