import fs from 'fs';

const readFile = async (filePath: string): Promise<any> => {
	try {
		const raw = fs.readFileSync(filePath);
		return JSON.parse(raw.toString());
	} catch (e) {
		return false;
	}
};

export default readFile;
