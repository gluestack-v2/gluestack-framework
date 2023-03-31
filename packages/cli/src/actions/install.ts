import https from 'https';

import download from '../helpers/download';
import getPlugin from '../helpers/getPlugin';
import variables from '../helpers/variables';
import metaExists from '../helpers/meta/exists';
import isGluePackage from '../helpers/isGluePackage';
import { writePlugin } from '../helpers/meta/plugins';
import getDependencies from '../helpers/get-dependencies';
import { success, error, newline } from '../helpers/print';
import removeSpecialChars from '../helpers/remove-special-chars';
import { fileExists, checkFolderIsEmpty } from '../helpers/file';
import { pluginInstance } from '../helpers/meta/plugin-instances';

import AppCLI from '../helpers/lib/app';
import undoDownload from '../helpers/undo-download';

const { setVar } = variables;

const prefix = 'glue-plugin-';
const metaPluginInstance = pluginInstance;

const validateAndGet = async (
	pluginName: string,
	instanceName: string
) => {
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
	const pluginFilePath =
		process.cwd() + '/.glue/internals/plugins.json';

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
};

const checkForPackage = (pluginName: string) => {
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
};

const checkForDependencies = async (
	app: AppCLI,
	packageName: string
) => {
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

		await undoDownload(packageName);
		console.log('\x1b[37m');
		process.exit(0);
	}
};

export default async (
	app: AppCLI,
	pluginName: string,
	instanceName: string
) => {
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
	if (
		folderPath !== process.cwd() &&
		!(await checkFolderIsEmpty(folderPath))
	) {
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
	await writePlugin(pluginFilePath, packageName, plugin);

	success(
		`Sucessfully installed '${pluginName}' as instance ${folderName} in directory '${folderPath}'`
	);
	newline();
};
