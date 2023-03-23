const { resolve } = require('path');
const { info } = require('./print');
const exec = require('child_process').exec;

async function execute(steps) {
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

module.exports = async (pluginName, packageName) => {
	info(`Installing '${pluginName}' from '${packageName}'`);
	if (packageName.startsWith('./') || packageName.startsWith('../')) {
		const localPackagePath = resolve(packageName);
		await execute([`npm install --save ${localPackagePath}`]);
	} else {
		await execute([`npm install --save ${packageName}`]);
	}
};
