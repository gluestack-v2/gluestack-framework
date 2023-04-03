import fs from 'fs';

const fileExists = (filePath: string): boolean =>
	fs.existsSync(filePath) ? true : false;

export default fileExists;
