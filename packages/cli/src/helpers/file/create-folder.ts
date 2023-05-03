import promises from 'fs';

const createFolder = async (_folder: string): Promise<boolean> => {
	try {
		promises.mkdirSync(_folder, { recursive: true });
	} catch (e) {
		return Promise.resolve(false);
	}
	return Promise.resolve(true);
};

export default createFolder;
