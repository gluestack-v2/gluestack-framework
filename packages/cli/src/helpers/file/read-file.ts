/* eslint-disable prettier/prettier */
import fs from 'fs';

const readFile = async (filePath: string): Promise<any> => {
	try {
		const raw = fs.readFileSync(filePath);
		return JSON.parse(raw.toString());
	} catch (e) {
		console.error(e, 'error');
		return false;
	}
};

export default readFile;
