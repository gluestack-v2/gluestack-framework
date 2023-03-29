import { promises } from 'fs';
const appendFileContent = async (
	filepath: string,
	content: string
): Promise<void> => {
	await promises.appendFile(filepath, content);
};

export default appendFileContent;
