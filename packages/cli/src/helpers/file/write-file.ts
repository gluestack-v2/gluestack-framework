import promises from 'fs';
import { error } from '../print';

const writeFile = async (path: string, content: string = '') => {
	try {
		await promises.writeFile(path, content, () => {});
	} catch (err: any) {
		error('Writing file failed: ' + err.message);
	}

	return Promise.resolve(true);
};

export default writeFile;
