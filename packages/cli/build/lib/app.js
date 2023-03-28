"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { join } = require('path');
const events = require('events');
const watcher = require('../helpers/watcher');
const runDoctor = require('../actions/doctor');
const { copyFolder } = require('../helpers/file');
const { injectPluginStore } = require('../helpers/getStorePath');
const { getTopToBottomPluginInstanceTree, attachPluginInstance, } = require('../helpers/meta/plugin-instances');
const GluePluginStoreFactory = require('../lib/factory/plugin/GluePluginStoreFactory');
const commander = require('../helpers/commander');
const commands = require('../commands');
class App {
    constructor() {
        // @API: addCommand
        this.addCommand = (runner) => __awaiter(this, void 0, void 0, function* () {
            this.commander.addCommand(this, runner);
        });
        this.commander = commander;
        this.eventEmitter = new events.EventEmitter();
        this.gluePluginStoreFactory = new GluePluginStoreFactory();
    }
    populatePlugins(localPlugins) {
        return __awaiter(this, void 0, void 0, function* () {
            const plugins = yield getTopToBottomPluginInstanceTree(this, process.cwd());
            let bootedPlugins = plugins.map(({ plugin }) => {
                return plugin;
            });
            let bootedLocalPlugins = localPlugins.map((PluginClass) => {
                const p = new PluginClass(this);
                return new PluginClass(this, injectPluginStore(this, p.getName()));
            });
            let mergedPlugins = bootedPlugins.concat(bootedLocalPlugins);
            //unique installed and local plugins
            mergedPlugins = [
                ...new Map(mergedPlugins.map((item) => [item.getName(), item])).values(),
            ];
            this.plugins = mergedPlugins;
        });
    }
    initPlugins(localPlugins) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.populatePlugins(localPlugins);
            for (const plugin of this.plugins) {
                yield plugin.init();
            }
            yield this.initPluginInstances();
        });
    }
    destroyPlugins() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.destroyPluginInstances();
            for (const plugin of this.plugins) {
                yield plugin.destroy();
            }
        });
    }
    initPluginInstances() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const plugin of this.plugins) {
                for (const instance of plugin.getInstances()) {
                    yield instance.init();
                }
            }
        });
    }
    destroyPluginInstances() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const plugin of this.plugins) {
                for (const instance of plugin.getInstances()) {
                    yield instance.destroy();
                }
            }
        });
    }
    // checks
    doctor() {
        return __awaiter(this, void 0, void 0, function* () {
            //
        });
    }
    // @API: dispatchEvent
    dispatchEvent(eventName, ...args) {
        this.eventEmitter.emit(eventName, ...args);
    }
    // @API: addEventListener
    addEventListener(eventName, callback = () => { }) {
        this.eventEmitter.on(eventName, callback);
    }
    // @API: createPluginInstance
    createPluginInstance(plugin, instance, src, target) {
        return __awaiter(this, void 0, void 0, function* () {
            if (src && target) {
                yield copyFolder(src, target);
            }
            return attachPluginInstance(this, plugin, instance, target);
        });
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
    watch(instancePath, pattern, callback) {
        watcher.watch(join(process.cwd(), instancePath), pattern, callback);
    }
    // @API: destroy
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            // destroy all plugins
            yield this.destroyPlugins();
            // close commander
            yield this.commander.destroy();
            // save changes made into all stores
            this.gluePluginStoreFactory.saveAllStores();
        });
    }
    // @API: init
    init(localPlugins) {
        return __awaiter(this, void 0, void 0, function* () {
            // initialise the commander
            yield this.commander.init();
            // initialise the local commands
            yield this.initLocalCommands();
            // initialise all plugins
            yield this.initPlugins(localPlugins);
        });
    }
    initLocalCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const command of commands()) {
                this.addCommand(command);
            }
        });
    }
}
module.exports = App;
