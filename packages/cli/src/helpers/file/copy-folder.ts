import fs from 'fs';
import { basename, join } from 'path';
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
		const targetFolder = join(target, basename(depth ? source : '.'));
		if (!(await fileExists(targetFolder))) {
			await createFolder(targetFolder);
		}

		// Copy
		if (
			fs.lstatSync(source).isDirectory() ||
			fs.lstatSync(source).isSymbolicLink()
		) {
			files = fs.readdirSync(source);
			for await (const file of files) {
				let curSource = join(source, file);
				if (fs.lstatSync(curSource).isDirectory()) {
					await copyFolder(curSource, targetFolder, ++depth);
				} else {
					await copyFile(curSource, targetFolder)
						.then(() => {
							// console.log('Copied the Folder');
						})
						.catch((e) => {
							// console.log(
							// 	'Faced an error while copying the Folder',
							// 	e
							// );
						});
				}
			}
		}
	}
};

export default copyFolder;
