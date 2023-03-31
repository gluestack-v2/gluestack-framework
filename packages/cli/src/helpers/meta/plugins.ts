import { isEmpty } from 'lodash';
import { error } from '../print';
import getPlugin from '../getPlugin';
import isGluePackage from '../isGluePackage';
import { readFile, writeFile } from '../file';
import AppCLI from '../../helpers/lib/app';

import IArrTree from '../../types/meta/interface/IArr';
import ITree from '../../types/meta/interface/ITree';
import IPlugin from '../../types/plugin/interface/IPlugin';
import IPluginJSON from '../../types/jsonFiles/interface/IPlugins';

export const writePlugin = async (
	pluginFilePath: string,
	pluginName: string,
	plugin: IPlugin
) => {
	let data: IPluginJSON = await readFile(pluginFilePath);
	if (!data) {
		error('.glue/internals plugins file is corrupted.');
		process.exit(0);
	}

	if (!data[pluginName]) {
		data[pluginName] = {
			package: pluginName,
		};
		// write plugins in file
		await writeFile(pluginFilePath, JSON.stringify(data, null, 2));
	}
};

export const getPluginTree = async (
	app: AppCLI,
	path: string,
	depth: number = 0,
	tree: ITree = {}
) => {
	let key = depth ? 'peerDependencies' : 'dependencies';
	const pluginFilePath = `${path}/package.json`;

	const data = await require(pluginFilePath);
	if (!data[key] || isEmpty(data[key])) {
		return null;
	}

	const plugins = Object.keys(data[key]).filter((_package) => {
		if (isGluePackage(_package)) return _package;
	});

	if (!plugins || !plugins.length) {
		return null;
	}

	for (const plugin of plugins) {
		tree[plugin] = {
			plugin: await getPlugin(app, plugin, plugin),
			dependencies: await getPluginTree(app, plugin, ++depth),
		};
	}

	return tree;
};

export const getTopToBottomPluginTree = async (
	app: AppCLI,
	path: string
) => {
	const tree = await getPluginTree(app, path);

	function recursivelyJoinArray(tree: ITree | null, arr: IArrTree) {
		if (tree && !isEmpty(tree)) {
			Object.keys(tree).forEach((key) => {
				if (tree[key].dependencies) {
					recursivelyJoinArray(tree[key].dependencies, arr);
				}
			});

			Object.keys(tree).forEach((key: string) => {
				if (tree[key].plugin) {
					const exists = arr.some((obj) => obj.key === key);
					if (!exists) {
						arr.push({
							key: key,
							plugin: tree[key].plugin,
						});
					}
				}
			});
		}

		return arr;
	}

	const arr: IArrTree = [];
	return recursivelyJoinArray(tree, arr);
};

export const getBottomToTopPluginTree = async (
	app: AppCLI,
	path: string
) => {
	const array = await getTopToBottomPluginTree(app, path);
	return array.reverse();
};
