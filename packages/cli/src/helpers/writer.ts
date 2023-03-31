import { join } from 'path';
import { createFolder, fileExists, copyFolder } from './file';

interface Writer {
	write(path: string, instanceName: string): Promise<void>;
}

const writer: Writer = {
	write: async (
		path: string,
		instanceName: string
	): Promise<void> => {
		const sealPath = join(process.cwd(), '.glue/seal/services');
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
	},
};

export default writer;
