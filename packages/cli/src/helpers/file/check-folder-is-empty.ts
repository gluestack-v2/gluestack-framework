import fs from 'fs';

const checkFolderIsEmpty = async (
	directoryPath: string
): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		fs.readdir(directoryPath, function (err, files) {
			if (err) {
				return resolve(true);
			}
			return resolve(files.length === 0);
		});
	});
};

export default checkFolderIsEmpty;
