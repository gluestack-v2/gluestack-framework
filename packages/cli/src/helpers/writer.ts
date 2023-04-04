import { join } from 'path';
import { IWriter } from '../types/app/interface/IWriter';
import { createFolder, fileExists, copyFolder } from './file';
import { SEAL_SERVICES_PATH } from '../constants/seal';

class Writer implements IWriter {
	async write (
		path: string,
		instanceName: string
	): Promise<void> {
		const sealPath = join(process.cwd(), SEAL_SERVICES_PATH);
		if (!fileExists(sealPath)) {
			await createFolder(sealPath);
		}

		const instancePath = join(
			sealPath,
			instanceName,
			'src',
			instanceName
		);
		if (!fileExists(instancePath)) {
			await createFolder(instancePath);
		}

		await copyFolder(path, instancePath);
	}
};

export default new Writer();
