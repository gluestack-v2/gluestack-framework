import events from 'events';
import writer from '../writer';
import watcher from '../watcher';
import {
	copyFolder,
	fileExists,
	readFile,
	rewriteFile,
	rm,
} from '../file';
import fs from 'fs';
import { injectPluginStore } from '../getStorePath';
import {
	getTopToBottomPluginInstanceTree,
	attachPluginInstance,
} from '../meta/plugin-instances';
import GluePluginStoreFactory from './factory/plugin/GluePluginStoreFactory';

import commander from '../commander';
import commands from '../../commands';

import IPlugin from '../../types/plugin/interface/IPlugin';
import ICommander from '../../types/helpers/interface/ICommander';
import { IWatchCallback } from '../../types/app/interface/IWatcher';
import IGluePluginStore from '../../types/store/interface/IGluePluginStore';
import IProgramCallback from '../../types/helpers/interface/ICommandCallback';
import IGluePluginStoreFactory from '../../types/store/interface/IGluePluginStoreFactory';
import { extname, join } from 'path';
import {
	GLUE_GENERATED_PACKAGES_PATH,
	GLUE_GENERATED_SERVICES_PATH,
} from '../../constants/gluestack.v2';
import IInstance from '../../types/plugin/interface/IInstance';

const sourceMap = require('source-map');

type PluginConstructor = new (
	app: AppCLI,
	gluePluginStore?: IGluePluginStore
) => IPlugin;

export default class AppCLI {
	plugins: Array<IPlugin>;
	commander: ICommander;
	eventEmitter: events;
	gluePluginStoreFactory: IGluePluginStoreFactory;

	constructor() {
		this.plugins = [];
		this.commander = commander;
		this.eventEmitter = new events.EventEmitter();
		this.gluePluginStoreFactory =
			new GluePluginStoreFactory() as IGluePluginStoreFactory;
	}

	// @API: addCommand
	addCommand = (runner: IProgramCallback) => {
		this.commander.addCommand(this, runner);
	};

	async populatePlugins(localPlugins: IPlugin[]) {
		const plugins = await getTopToBottomPluginInstanceTree(
			this,
			process.cwd()
		);

		// boot plugins in npm
		let bootedPlugins = plugins.map(({ plugin }) => plugin);

		// boot plugins in local
		let bootedLocalPlugins = localPlugins.map((PluginClass) => {
			const that = this;

			const loadPlugins = (PluginClass: PluginConstructor) => {
				const p = new PluginClass(that);

				return new PluginClass(
					that,
					injectPluginStore(this, p.getName())
				);
			};

			// @ts-ignore
			return loadPlugins(PluginClass);
		});

		let mergedPlugins = bootedPlugins.concat(bootedLocalPlugins);

		// unique installed and local plugins
		mergedPlugins = [
			...new Map(
				mergedPlugins.map((item) => [item.getName(), item])
			).values(),
		];

		this.plugins = mergedPlugins;
	}

	async initPlugins(localPlugins: Array<IPlugin>) {
		await this.populatePlugins(localPlugins);

		for (const plugin of this.plugins) {
			await plugin.init();
		}

		await this.initPluginInstances();
	}

	async destroyPlugins() {
		await this.destroyPluginInstances();
		for (const plugin of this.plugins) {
			await plugin.destroy();
		}
	}

	async initPluginInstances() {
		for (const plugin of this.plugins) {
			for (const instance of plugin.getInstances()) {
				await instance.init();
			}
		}
	}

	async destroyPluginInstances() {
		for (const plugin of this.plugins) {
			for (const instance of plugin.getInstances()) {
				await instance.destroy();
			}
		}
	}

	// @API: doctor
	async doctor() {
		//
	}

	// @API: dispatchEvent
	dispatchEvent(eventName: string, ...args: any) {
		this.eventEmitter.emit(eventName, ...args);
	}

	// @API: addEventListener
	addEventListener(
		eventName: string,
		callback = (...args: any) => {}
	) {
		this.eventEmitter.on(eventName, callback);
	}

	// @API: createPluginInstance
	async createPluginInstance(
		plugin: IPlugin,
		instance: string,
		src?: string,
		target?: string
	) {
		if (src && target) {
			await copyFolder(src, target);
		}
		return attachPluginInstance(
			this,
			plugin,
			instance,
			target ? target : ''
		);
	}

	// @API: getPluginByName
	getPluginByName(pluginName: string) {
		for (const plugin of this.plugins) {
			if (plugin.getName() === pluginName) {
				return plugin;
			}
		}
		return null;
	}

	// @API: getPlugins
	getPlugins() {
		return this.plugins;
	}

	// @API: getContainerTypePluginInstances
	getContainerTypePluginInstances(bottomToTop = false) {
		const instances = [];
		for (const plugin of this.plugins) {
			for (const instance of plugin.getInstances()) {
				if (!instance.isOfTypeInstance) {
					instances.push(instance);
				}
			}
		}
		if (bottomToTop) {
			return instances.reverse();
		}
		return instances;
	}

	// @API: watch
	listen(
		cwd: string,
		pattern: string | string[],
		callback: IWatchCallback
	): void {
		watcher.watch(cwd, pattern, callback);
	}

	generateSourceMap(
		sourcePath: string,
		destinationPath: string
	): void {
		const filePathExtension: string = extname(sourcePath);

		if (!['.ts', '.js'].includes(filePathExtension)) {
			return;
		}

		const generator = new sourceMap.SourceMapGenerator({
			file: sourcePath,
			sourceRoot: '',
		});

		// Add mapping
		const source = fs.readFileSync(sourcePath, 'utf8');
		const lines = source.split('\n');
		for (let i = 0; i < lines.length; i++) {
			const columns = lines[i].split('');
			for (let j = 0; j < columns.length; j++) {
				generator.addMapping({
					source: sourcePath,
					original: { line: i + 1, column: j },
					generated: { line: i + 1, column: j },
				});
			}
		}

		const sourceMapString = generator.toString();
		fs.writeFileSync(destinationPath + '.map', sourceMapString);
		fs.appendFileSync(
			destinationPath,
			`\n//# sourceMappingURL=${destinationPath}.map`
		);
	}

	removeSourceMap(destinationPath: string): void {
		fs.rmSync(destinationPath + '.map');
	}

	watch(
		source: string,
		destination: string,
		callback: IWatchCallback
	): void {
		this.listen(source, ['./'], (event: string, path: string) => {
			const sourcePath = join(source, path);
			const destinationPath = join(destination, path);

			if (destination) {
				switch (event) {
					case 'add':
						fs.copyFileSync(sourcePath, destinationPath);
						this.generateSourceMap(sourcePath, destinationPath);
						break;
					case 'addDir':
						fs.mkdirSync(destinationPath, { recursive: true });
						break;
					case 'change':
						fs.copyFileSync(sourcePath, destinationPath);
						this.generateSourceMap(sourcePath, destinationPath);
						break;
					case 'unlinkDir':
						fs.rmSync(destinationPath, { recursive: true });
						break;
					case 'unlink':
						fs.rmSync(destinationPath);
						this.removeSourceMap(destinationPath);

						break;
				}
			}

			callback(event, path);
		});
	}

	// @API: writer
	async write(source: string, destination: string): Promise<void> {
		await writer.write(source, destination);
	}

	// @API: destroy
	async destroy() {
		// destroy all plugins
		await this.destroyPlugins();
		// close commander
		this.commander.destroy();
		// save changes made into all stores
		this.gluePluginStoreFactory.saveAllStores();
	}

	// @API: init
	async init(localPlugins: Array<IPlugin>) {
		// initialise the commander
		this.commander.init();
		// initialise the local commands
		await this.initLocalCommands();
		// initialise all plugins
		await this.initPlugins(localPlugins);
	}

	async initLocalCommands() {
		for (const command of commands()) {
			this.addCommand(command);
		}
	}

	async updateServices(instanceWorkspacePath: string = '') {
		const packagesPath = join(
			process.cwd(),
			GLUE_GENERATED_PACKAGES_PATH
		);

		const updatePackageInService = async (servicePath: string) => {
			if (await fileExists(servicePath)) {
				rm(join(servicePath, 'packages'));
				await copyFolder(packagesPath, servicePath + '/packages');
			}
		};
		const servicesPath = this.getAllServicePaths();

		if (instanceWorkspacePath) {
			await updatePackageInService(instanceWorkspacePath);
		} else if (servicesPath.length > 0) {
			for await (const path of servicesPath) {
				let servicePath = join(path, '/src');
				await updatePackageInService(servicePath);
			}
		} else {
			// console.log('No services found');
		}
	}

	async replaceTemplateValues(
		filePath: string,
		template: string,
		value: string
	) {
		let data = fs.readFileSync(filePath, { encoding: 'utf-8' });
		data = data.replace(template, value);
		fs.writeFileSync(filePath, data);
	}

	getAllServicePaths() {
		const servicesPath = join(
			process.cwd(),
			GLUE_GENERATED_SERVICES_PATH
		);
		if (!fs.existsSync(servicesPath)) {
			return [];
		}
		return fs
			.readdirSync(servicesPath, { withFileTypes: true })
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => join(servicesPath, dirent.name));
	}

	getAllPackagePaths() {
		const packagesPath = join(
			process.cwd(),
			GLUE_GENERATED_PACKAGES_PATH
		);
		if (!fs.existsSync(packagesPath)) {
			return [];
		}
		return fs
			.readdirSync(packagesPath, { withFileTypes: true })
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => join(packagesPath, dirent.name));
	}

	getAllServiceInstances() {
		let plugins = this.getPlugins();
		let allInstances: Array<IInstance> = [];
		for (const plugin of plugins) {
			allInstances.push(...plugin.getInstances());
		}
		return allInstances.filter(
			(instance) => instance._instanceType === 'service'
		);
	}

	async updateNameInPackageJSON(
		packagePath: string,
		packageName: string
	) {
		const packageJSONPath = join(packagePath, 'package.json');
		await rewriteFile(packageJSONPath, packageName, 'INSTANCENAME');
	}

	// async updateDestinationPackageJSON() {
	// 	// update package.json'S name index with the new instance name
	// 	const pluginPackage = `${this._destinationPath}/package.json`;
	// 	await rewriteFile(pluginPackage, this.getName(), 'INSTANCENAME');
	// }

	// async updateRootPackageJSONWithSourcePath() {
	// 	// update root package.json's workspaces with the new instance name
	// 	const rootPackage: string = `${process.cwd()}/package.json`;
	// 	await Workspaces.append(
	// 		rootPackage,
	// 		relative(process.cwd(), this._sourcePath)
	// 	);
	// }

	// async updateRootPackageJSONWithDestinationPath() {
	// 	const rootPackage: string = `${process.cwd()}/package.json`;
	// 	await Workspaces.append(
	// 		rootPackage,
	// 		relative(process.cwd(), this._destinationPath)
	// 	);
	// }

	async createPackage(
		packageName: string,
		packageSourcePath?: string
	) {
		const packagePath = join(
			process.cwd(),
			GLUE_GENERATED_PACKAGES_PATH,
			packageName
		);
		if (packageSourcePath) {
			await this.write(packageSourcePath, packagePath);
		} else {
			const packageTemplatePath = join(
				process.cwd(),
				'node_modules',
				'@gluestack-v2/framework-cli',
				'src',
				'helpers',
				'templates',
				'package'
			);
			await this.write(packageTemplatePath, packagePath);
		}
		await this.updateNameInPackageJSON(packagePath, packageName);
		return packagePath;
	}

	// async generateSDK(
	// 	sourcePath: string,
	// 	instanceName: string,
	// 	ignoredPaths: any
	// ) {
	// 	const instances = this.getInstances();
	// 	if (this.instances.length === 0) {
	// 		return;
	// 	}

	// 	for await (const instance of instances) {
	// 		if (!existsSync(sourcePath)) {
	// 			console.log("> No functions plugin found, create instance first");
	// 		} else {
	// 			await writeSDK(sourcePath, instance._destinationPath, ignoredPaths);
	// 		}
	// 	}
	// 	this.app.updateServices();

	// }
}
