import { access } from "fs/promises"

export const fileExists = async (filepath: string): Promise<boolean> => {
  try {
    await access(filepath);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.resolve(false);
  }
};
