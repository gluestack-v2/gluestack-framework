import { readFile } from 'fs/promises';

export const readfile = async (filepath: string): Promise<string> => {
  return await readFile(filepath, 'utf8');
};
