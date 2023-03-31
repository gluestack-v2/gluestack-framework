var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "events", "../watcher", "../file", "../getStorePath", "../meta/plugin-instances", "./factory/plugin/GluePluginStoreFactory", "../commander", "../../commands"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    const events_1 = __importDefault(require("events"));
    const watcher_1 = __importDefault(require("../watcher"));
    const file_1 = require("../file");
    const getStorePath_1 = require("../getStorePath");
    const plugin_instances_1 = require("../meta/plugin-instances");
    const GluePluginStoreFactory_1 = __importDefault(require("./factory/plugin/GluePluginStoreFactory"));
    const commander_1 = __importDefault(require("../commander"));
    const commands_1 = __importDefault(require("../../commands"));
    class App {
        constructor() {
            // @API: addCommand
            this.addCommand = (runner) => {
                this.commander.addCommand(this, runner);
            };
            this.plugins = [];
            this.commander = commander_1.default;
            this.eventEmitter = new events_1.default.EventEmitter();
            this.gluePluginStoreFactory = new GluePluginStoreFactory_1.default();
        }
        populatePlugins(localPlugins) {
            return __awaiter(this, void 0, void 0, function* () {
                const plugins = yield (0, plugin_instances_1.getTopToBottomPluginInstanceTree)(this, process.cwd());
                let bootedPlugins = plugins.map(({ plugin }) => {
                    return plugin;
                });
                function Object(plug, pa) {
                    const p = new plug(pa);
                    const pObj = new plug(pa, (0, getStorePath_1.injectPluginStore)(pa, p.getName()));
                    return pObj;
                }
                let bootedLocalPlugins = localPlugins.map((PluginClass) => {
                    const typedClass = PluginClass;
                    const pObj = Object(typedClass, this);
                    return pObj;
                });
                let mergedPlugins = bootedPlugins.concat(bootedLocalPlugins);
                //unique installed and local plugins
                mergedPlugins = [
                    ...new Map(mergedPlugins.map((item) => [item.getName(), item])).values(),
                ];
                this.plugins = mergedPlugins;
            });
        }
        //sdfjklh
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
        // @API: doctor
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
                    yield (0, file_1.copyFolder)(src, target);
                }
                return (0, plugin_instances_1.attachPluginInstance)(this, plugin, instance, target);
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
            watcher_1.default.watch((0, path_1.join)(process.cwd(), instancePath), pattern, callback);
        }
        // @API: destroy
        destroy() {
            return __awaiter(this, void 0, void 0, function* () {
                // destroy all plugins
                yield this.destroyPlugins();
                // close commander
                this.commander.destroy();
                // save changes made into all stores
                this.gluePluginStoreFactory.saveAllStores();
            });
        }
        // @API: init
        init(localPlugins) {
            return __awaiter(this, void 0, void 0, function* () {
                // initialise the commander
                this.commander.init();
                // initialise the local commands
                yield this.initLocalCommands();
                // initialise all plugins
                yield this.initPlugins(localPlugins);
            });
        }
        initLocalCommands() {
            return __awaiter(this, void 0, void 0, function* () {
                for (const command of (0, commands_1.default)()) {
                    this.addCommand(command);
                }
            });
        }
    }
    exports.default = App;
});
