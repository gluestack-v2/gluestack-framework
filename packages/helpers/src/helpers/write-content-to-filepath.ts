import { dirname } from 'path';
import { mkdir, writeFile } from 'fs/promises';

export const writeContentToFilePath = async (filePath: string, content: string) => {
  const _dirname = dirname(filePath);

  return mkdir(_dirname, { recursive: true })
    .then(() => writeFile(filePath, content))
    .then(() => Promise.resolve(`File created at ${filePath} with content: `))
    .catch((err) => Promise.reject(console.error(err)));
};