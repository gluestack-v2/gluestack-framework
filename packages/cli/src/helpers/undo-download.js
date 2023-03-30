const { resolve } = require('path');
const exec = require('child_process').exec;

async function execute(steps) {
	for (const step of steps) {
		await new Promise((resolve, reject) => {
			exec(step, async (error, _stdout, _stderr) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(true);
			});
		});
	}
}

module.exports = async (packageName) => {
	if (packageName.startsWith('./') || packageName.startsWith('../')) {
		const localPackagePath = resolve(packageName);
		await execute([`npm uninstall ${localPackagePath}`]);
	} else {
		await execute([`npm uninstall ${packageName}`]);
	}
};
