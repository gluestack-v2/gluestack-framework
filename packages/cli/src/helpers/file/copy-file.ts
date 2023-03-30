import fs from 'fs';
import path from 'path';
import fileExists from './file-exists';

const copyFile = async (
	source: string,
	target: string
): Promise<void> => {
	let targetFile = target;

	// If target is a directory, a new file with the same name will be created
	if (fileExists(target)) {
		if (fs.lstatSync(target).isDirectory()) {
			targetFile = path.join(target, path.basename(source));
		}
	}

	await fs.writeFileSync(targetFile, fs.readFileSync(source));
};

export default copyFile;
