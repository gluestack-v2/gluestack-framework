import promises from 'fs';

const createFolder = async (_folder: string): Promise<boolean> => {
  promises.mkdirSync(_folder, { recursive: true });
  return Promise.resolve(true);
};

export default createFolder;
