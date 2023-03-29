import { isEmpty } from 'lodash';
import { readFile, writeFile } from '../file';
import getPlugin from '../getPlugin';
import isGluePackage from '../isGluePackage';
import { error } from '../print';

import IPluginJSON from '../../types/jsonFiles/interface/IPlugins';
import IArrTree from '../../types/meta/interface/IArr';
import ITree from '../../types/meta/interface/ITree';
import IPlugin from '../../types/plugin/interface/IPlugin';
import IAppCLI from '../../types/app/interface/IAppCLI';

const writePlugin = async (
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

const getPluginTree = async (
	app: IAppCLI,
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

async function getTopToBottomPluginTree(app: IAppCLI, path: string) {
	const tree = await getPluginTree(app, path);

	function recursivelyJoinArray(tree: ITree | null, arr: IArrTree) {
		if (tree && !isEmpty(tree)) {
			Object.keys(tree).forEach((key) => {
				if (tree[key].plugin) {
					arr.push({
						key: key,
						plugin: tree[key].plugin,
					});
				}
			});
			Object.keys(tree).forEach((key) => {
				if (tree[key].dependencies) {
					recursivelyJoinArray(tree[key].dependencies, arr);
				}
			});
		}
		return arr;
	}

	return recursivelyJoinArray(tree, []);
}

async function getBottomToTopPluginTree(app: IAppCLI, path: string) {
	const array = await getTopToBottomPluginTree(app, path);
	return array.reverse();
}

export {
	writePlugin,
	getPluginTree,
	getTopToBottomPluginTree,
	getBottomToTopPluginTree,
};
