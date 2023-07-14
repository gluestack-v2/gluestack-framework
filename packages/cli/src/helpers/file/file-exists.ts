import { access, constants } from 'node:fs/promises';
import { accessSync } from 'node:fs';
const fileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch (err) {
    return false;
  }
};

export default fileExists;

export const fileExistsSync = (path: string): boolean => {
  try {
    accessSync(path, constants.R_OK);
    return true;
  } catch (err) {
    return false;
  }
};
