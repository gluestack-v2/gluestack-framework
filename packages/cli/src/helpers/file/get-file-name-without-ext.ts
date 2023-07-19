import path from 'path';

function getFileNameWithoutExtension(filePath: string) {
	const basename = path.basename(filePath);
	const parsed = path.parse(basename);
	return parsed.name;
}

export default getFileNameWithoutExtension;
