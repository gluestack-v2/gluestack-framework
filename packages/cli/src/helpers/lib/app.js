const { join } = require('path');
const events = require('events');
const watcher = require('../watcher');
const runDoctor = require('../../actions/doctor');
const { copyFolder } = require('../file');
const { injectPluginStore } = require('../getStorePath');
const {
	getTopToBottomPluginInstanceTree,
	attachPluginInstance,
} = require('../meta/plugin-instances');
const GluePluginStoreFactory = require('./factory/plugin/GluePluginStoreFactory');

const commander = require('../commander');
const commands = require('../../commands');

class App {
	constructor() {
		this.commander = commander;
		this.eventEmitter = new events.EventEmitter();
		this.gluePluginStoreFactory = new GluePluginStoreFactory();
	}

	// @API: addCommand
	addCommand = (runner) => {
		this.commander.addCommand(this, runner);
	};

	async populatePlugins(localPlugins) {
		const plugins = await getTopToBottomPluginInstanceTree(
			this,
			process.cwd()
		);
		let bootedPlugins = plugins.map(({ plugin }) => {
			return plugin;
		});
		let bootedLocalPlugins = localPlugins.map((PluginClass) => {
			const p = new PluginClass(this);
			return new PluginClass(
				this,
				injectPluginStore(this, p.getName())
			);
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

	async initPlugins(localPlugins) {
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
	dispatchEvent(eventName, ...args) {
		this.eventEmitter.emit(eventName, ...args);
	}

	// @API: addEventListener
	addEventListener(eventName, callback = () => {}) {
		this.eventEmitter.on(eventName, callback);
	}

	// @API: createPluginInstance
	async createPluginInstance(plugin, instance, src, target) {
		if (src && target) {
			await copyFolder(src, target);
		}
		return attachPluginInstance(this, plugin, instance, target);
	}

	// @API: getPluginByName
	getPluginByName(pluginName) {
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
	watch (instancePath, pattern, callback) {
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
	async init (localPlugins) {
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

module.exports = App;
