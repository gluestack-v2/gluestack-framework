import { IWriter } from '../types/app/interface/IWriter';
import { isFile, copyFolder, copyFile } from './file';

class Writer implements IWriter {
  async write(source: string, destination: string): Promise<void> {
    if (isFile(source)) {
      await copyFile(source, destination);
    }
    await copyFolder(source, destination);
  }
}

export default new Writer();
