export const addTrailingSlash = (str: string): string => {
  if (str[str.length - 1] === '/') {
    return str;
  } else {
    return str + '/';
  }
};
