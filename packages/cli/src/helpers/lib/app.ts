import { join } from 'path';
import events from 'events';
import watcher from '../watcher';
import { copyFolder } from '../file';
import { injectPluginStore } from '../getStorePath';
import {
	getTopToBottomPluginInstanceTree,
	attachPluginInstance,
} from '../meta/plugin-instances';
import GluePluginStoreFactory from './factory/plugin/GluePluginStoreFactory';

import commander from '../commander';
import commands from '../../commands';

import IEventEmitter from 'events';
import Icommander from '../../types/helpers/interface/ICommander';
import IGluePluginStoreFactory from '../../types/store/interface/IGluePluginStoreFactory';
import ICmd from '../../types/helpers/interface/ICommandCallback';
import { WatchCallback } from '../../types/app/interface/IWatchCallback';
import IPlugin, { ITSPlugin } from '../../types/plugin/interface/IPlugin';

class App {
	plugins: Array<IPlugin>;
	commander : Icommander;
	eventEmitter: IEventEmitter;
	gluePluginStoreFactory: IGluePluginStoreFactory;

	constructor() {
		this.plugins = [];
		this.commander = commander;
		this.eventEmitter = new events.EventEmitter();
		this.gluePluginStoreFactory = new GluePluginStoreFactory() as IGluePluginStoreFactory;
	}

	// @API: addCommand
	addCommand = (runner: ICmd) => {
		this.commander.addCommand(this, runner);
	};
	
	async populatePlugins(localPlugins: Array<IPlugin>) {
		const plugins = await getTopToBottomPluginInstanceTree(
			this,
			process.cwd()
		);
		let bootedPlugins = plugins.map(({ plugin }) => {
			return plugin;
		});

		function Object(plug:ITSPlugin, pa: App){
			const p = new plug(pa);
			const pObj = new plug(
				pa,
				injectPluginStore(pa, p.getName())
			) as IPlugin;
			return pObj;
		}

		let bootedLocalPlugins = localPlugins.map((PluginClass) => {
			const typedClass = PluginClass as ITSPlugin;
			const pObj = Object(typedClass, this);
			return pObj;
		});

		let mergedPlugins = bootedPlugins.concat(bootedLocalPlugins);
		//unique installed and local plugins
		mergedPlugins = [
			...new Map(
				mergedPlugins.map((item) => [item.getName(), item])
			).values(),
		];
		this.plugins = mergedPlugins;
	}

//sdfjklh
	async initPlugins(localPlugins:Array<IPlugin>) {
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
	addEventListener(eventName: string, callback = () => {}) {
		this.eventEmitter.on(eventName, callback);
	}

	// @API: createPluginInstance
	async createPluginInstance(plugin: IPlugin, instance: string, src: string, target: string) {
		if (src && target) {
			await copyFolder(src, target);
		}
		return attachPluginInstance(this, plugin, instance, target);
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
	watch (instancePath: string, pattern: string|string[], callback: WatchCallback) {
		watcher.watch(
			join(process.cwd(), instancePath),
			pattern,
			callback
		);
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
	async init (localPlugins: Array<IPlugin>) {//gs plugin
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
}

export default App;
