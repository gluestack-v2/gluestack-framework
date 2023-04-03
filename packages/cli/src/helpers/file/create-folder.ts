import promises from 'fs';

const createFolder = async (_folder: string): Promise<boolean> => {
	// await promises.rm(_folder, { recursive: true, force: true });
	promises.mkdirSync(_folder, { recursive: true });

	return Promise.resolve(true);
};

export default createFolder;
