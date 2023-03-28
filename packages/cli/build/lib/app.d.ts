export = App;
declare class App {
    commander: typeof commander;
    eventEmitter: events;
    gluePluginStoreFactory: GluePluginStoreFactory;
    addCommand: (runner: any) => Promise<void>;
    populatePlugins(localPlugins: any): Promise<void>;
    plugins: any[] | undefined;
    initPlugins(localPlugins: any): Promise<void>;
    destroyPlugins(): Promise<void>;
    initPluginInstances(): Promise<void>;
    destroyPluginInstances(): Promise<void>;
    doctor(): Promise<void>;
    dispatchEvent(eventName: any, ...args: any[]): void;
    addEventListener(eventName: any, callback?: () => void): void;
    createPluginInstance(plugin: any, instance: any, src: any, target: any): Promise<any>;
    getPluginByName(pluginName: any): any;
    getPlugins(): any[] | undefined;
    getContainerTypePluginInstances(bottomToTop?: boolean): any[];
    watch(instancePath: any, pattern: any, callback: any): void;
    destroy(): Promise<void>;
    init(localPlugins: any): Promise<void>;
    initLocalCommands(): Promise<void>;
}
import commander = require("../helpers/commander");
import events = require("events");
import GluePluginStoreFactory = require("../lib/factory/plugin/GluePluginStoreFactory");
