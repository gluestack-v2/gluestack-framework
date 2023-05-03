import fs from 'fs';

const rm = (filePath: string) => {
	try {
		fs.rmSync(filePath, { recursive: true, force: true });
		return true;
	} catch (e) {
		return false;
	}
};

export default rm;
