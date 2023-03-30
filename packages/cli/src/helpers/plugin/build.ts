import { exec } from 'child_process';
import { fileExists, copyFile, createFolder } from '../file';
import { error, info } from '../print';

interface TsStubFile {
	source: string;
	target: string;
	dir?: string;
}

const tsStubFiles: TsStubFile[] = [
	{
		source:
			'node_modules/@gluestack-v2/framework-cli/build/types/plugin/stubs/tsconfig.json.txt',
		target: 'tsconfig.json',
	},
];

async function copyTsFiles(currentDir: string): Promise<void> {
	for (const stubFile of tsStubFiles) {
		if (stubFile.dir) {
			if (!(await fileExists(stubFile.dir))) {
				await createFolder(stubFile.dir);
			}
		}
		await copyFile(
			`${currentDir}/${stubFile.source}`,
			`${currentDir}/${stubFile.target}`
		);
	}
}

async function runner(): Promise<void> {
	const steps = ['tsc'];
	for (const step of steps) {
		await new Promise((resolve, reject) => {
			exec(step, async (err, stdout, stderr) => {
				resolve(true);
			});
		});
	}
}

export default async (currentDir: string): Promise<void> => {
	await copyTsFiles(currentDir);
	await runner();
};
