/* eslint-disable prettier/prettier */
import fs from 'fs';

const readEnvFile = async (filePath: string): Promise<any> => {
	try {
		if (fs.existsSync(filePath)) {
			const raw = fs.readFileSync(filePath);
			return raw.toString();
		}
	} catch (e) {
		console.error(e, 'error');
		return false;
	}
};

export default readEnvFile;
