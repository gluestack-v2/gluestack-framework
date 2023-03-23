export = App;
declare class App {
    commands: any[];
    eventEmitter: events;
    gluePluginStoreFactory: GluePluginStoreFactory;
    addCommand: (runner: any) => Promise<number>;
    populatePlugins(localPlugins: any): Promise<void>;
    plugins: any[] | undefined;
    initPlugins(localPlugins: any): Promise<void>;
    destroyPlugins(): Promise<void>;
    initPluginInstances(): Promise<void>;
    destroyPluginInstances(): Promise<void>;
    doctor(): Promise<void>;
    dispatchEvent(eventName: any): void;
    addEventListener(eventName: any, callback?: () => void): void;
    createPluginInstance(plugin: any, instance: any, src: any, target: any): Promise<any>;
    getPluginByName(pluginName: any): any;
    getContainerTypePluginInstances(bottomToTop?: boolean): any[];
}
import events = require("events");
import GluePluginStoreFactory = require("../lib/factory/plugin/GluePluginStoreFactory");
