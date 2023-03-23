const fs = require('fs');

const checkFolderIsEmpty = async (directoryPath) => {
	return new Promise((resolve, reject) => {
		fs.readdir(directoryPath, function (err, files) {
			if (err) {
				return resolve(true);
			}
			return resolve(files.length === 0);
		});
	});
};

module.exports = { checkFolderIsEmpty };
