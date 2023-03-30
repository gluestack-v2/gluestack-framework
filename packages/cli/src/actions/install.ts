import https from 'https';
import variables from '../helpers/variables';
import { fileExists, checkFolderIsEmpty } from '../helpers/file';
import download from '../helpers/download';
import { pluginInstance } from '../helpers/meta/plugin-instances';
import metaExists from '../helpers/meta/exists';
import { success, error, newline } from '../helpers/print';
import { writePlugin } from '../helpers/meta/plugins';
import getPlugin from '../helpers/getPlugin';
import isGluePackage from '../helpers/isGluePackage';
import getDependencies from '../helpers/get-dependencies';
import removeSpecialChars from '../helpers/remove-special-chars';

import IAppCLI from '../types/app/interface/IAppCLI';

const { setVar } = variables;

const prefix = 'glue-plugin-';
const metaPluginInstance = pluginInstance;

async function validateAndGet(pluginName: string, instanceName: string) {
	let packageName = pluginName;
	try {
		await checkForPackage(pluginName);
		packageName = `@gluestack-v2/${prefix}${pluginName}`;
	} catch (e) {
		//
	}

	if (!isGluePackage(packageName)) {
		error(`"${packageName}" is not supported`);
		process.exit(0);
	}

	instanceName = removeSpecialChars(instanceName);
	if (instanceName.indexOf('/') !== -1) {
		error(
			`${instanceName} is not valid, does not support nested instance.`
		);
		process.exit(0);
	}

	// adding the installed plugins
	const pluginInstancesFilePath =
		process.cwd() + '/.glue/internals/plugin-instances.json';
	const pluginFilePath = process.cwd() + '/.glue/internals/plugins.json';

	if (!fileExists(pluginFilePath)) {
		error(
			"Meta file is missing. Please go to project's root directory."
		);
		process.exit(0);
	}

	// check if plugin exists
	await metaExists(pluginInstancesFilePath, instanceName);

	return {
		pluginInstancesFilePath,
		pluginFilePath,
		folderName: instanceName,
		packageName,
	};
}

function checkForPackage(pluginName: string) {
	return new Promise((resolve, reject) => {
		https
			.get(
				`https://registry.npmjs.org/@gluestack-v2/${prefix}${pluginName}`,
				(res) => {
					if (res.statusCode === 200) {
						let body = '';
						res.on('data', (data) => (body += data));
						res.on('end', () => {
							resolve(JSON.parse(body).latest);
						});
					} else {
						reject();
					}
				}
			)
			.on('error', (e) => {
				reject(e);
			});
	});
}

export default async (app: IAppCLI, pluginName: string, instanceName: string) => {
	setVar('pluginName', pluginName);

	const {
		pluginInstancesFilePath,
		pluginFilePath,
		folderName,
		packageName,
	} = await validateAndGet(pluginName, instanceName);

	// download plugin project
	await download(pluginName, packageName);

	const plugin = await getPlugin(app, packageName, packageName, true);

	const folderPath = await plugin.getInstallationPath(folderName);
	if (folderPath !== process.cwd() && !(await checkFolderIsEmpty(folderPath))) {
		error(
			`${pluginName} installed failed: ${folderPath} is not empty`
		);
		process.exit(0);
	}

	await checkForDependencies(app, packageName);

	try {
		await plugin.runPostInstall(folderName, folderPath);
	} catch (e: any) {
		error(
			`${pluginName} installed failed: ${
				e.message || 'Something went wrong'
			}`
		);
		newline();
		process.exit(0);
	}

	// updates meta/plugin-instances.json file
	await metaPluginInstance(
		pluginInstancesFilePath,
		packageName,
		folderName,
		folderPath
	);
	await writePlugin(
		pluginFilePath,
		packageName,
		plugin
	);

	success(
		`Sucessfully installed '${pluginName}' as instance ${folderName} in directory '${folderPath}'`
	);
	newline();
};

async function checkForDependencies(app: IAppCLI, packageName: string) {
	let missing = [];
	const dependencies = await getDependencies(app, packageName);
	for (const plugin of dependencies) {
		if (plugin.getInstances().length === 0) {
			missing.push(plugin);
		}
	}

	if (missing.length) {
		error(`${packageName} installed failed: Missing dependencies`);
		console.log('\x1b[36m');
		for (const plugin of missing) {
			let arr = plugin.getName().split('-');
			console.log(
				`Install dependency: \`node glue add ${plugin.getName()} ${
					arr[arr.length - 1]
				}\``
			);
		}
		console.log('\x1b[37m');
		newline();
		process.exit(0);
	}
}
