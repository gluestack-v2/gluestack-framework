import { join } from 'path';
import { IWriter } from '../types/app/interface/IWriter';
import { createFolder, fileExists, copyFolder } from './file';
import { SEAL_SERVICES_PATH } from '../constants/seal';

class Writer implements IWriter {
	async write (
		source: string,
		destination: string
	): Promise<void> {
		await copyFolder(source, destination);
	}
};

export default new Writer();
