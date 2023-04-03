import { access, constants } from 'node:fs/promises';

const fileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch (err) {
    return false;
  }
};

export default fileExists;
