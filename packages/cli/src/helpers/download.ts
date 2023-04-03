import { resolve } from 'path';
import { info } from './print';
import { exec } from 'child_process';

async function execute(steps: string[]) {
	for (const step of steps) {
		await new Promise((resolve, reject) => {
			exec(step, async (error, stdout, stderr) => {
				if (error) {
					reject(error);
					return;
				}
				info(stdout);
				resolve(true);
			});
		});
	}
}

export default async (pluginName: string, packageName: string) => {
	info(`Installing '${pluginName}' from '${packageName}'`);
	if (packageName.startsWith('./') || packageName.startsWith('../')) {
		const localPackagePath = resolve(packageName);
		await execute([`npm install --save ${localPackagePath}`]);
	} else {
		await execute([`npm install --save ${packageName}`]);
	}
};
