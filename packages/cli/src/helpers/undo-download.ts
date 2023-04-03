import { resolve } from 'path';
import { exec } from 'child_process';

async function execute(steps: string[]) {
	for (const step of steps) {
		await new Promise((resolve, reject) => {
			exec(step, async (error, stdout, stderr) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(true);
			});
		});
	}
}

export default async (packageName: string) => {
	if (packageName.startsWith('./') || packageName.startsWith('../')) {
		const localPackagePath = resolve(packageName);
		await execute([`npm uninstall ${localPackagePath}`]);
	} else {
		await execute([`npm uninstall ${packageName}`]);
	}
};
