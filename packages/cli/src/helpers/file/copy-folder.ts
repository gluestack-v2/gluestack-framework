import fs from 'fs';
import path from 'path';
import copyFile from './copy-file';
import createFolder from './create-folder';
import fileExists from './file-exists';

const copyFolder = async (
	source: string,
	target: string,
	depth: number = 0
) => {
	if (!source.includes('.git')) {
		let files = [];

		// Check if folder needs to be created or integrated
		const targetFolder = path.join(
			target,
			path.basename(depth ? source : '.')
		);
		if (!(await fileExists(targetFolder))) {
			await createFolder(targetFolder);
		}

		// Copy
		if (
			fs.lstatSync(source).isDirectory() ||
			fs.lstatSync(source).isSymbolicLink()
		) {
			files = fs.readdirSync(source);
			files.forEach(async (file) => {
				let curSource = path.join(source, file);
				if (fs.lstatSync(curSource).isDirectory()) {
					await copyFolder(curSource, targetFolder, depth++);
				} else {
					await copyFile(curSource, targetFolder);
				}
			});
		}
	}
};

export default copyFolder;
