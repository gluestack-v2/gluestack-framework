/// <reference types="node" />
import IEventEmitter from 'events';
import Icommander from '../../types/helpers/interface/ICommander';
import IGluePluginStoreFactory from '../../types/store/interface/IGluePluginStoreFactory';
import ICmd from '../../types/helpers/interface/ICommandCallback';
import { WatchCallback } from '../../types/app/interface/IWatchCallback';
import IPlugin from '../../types/plugin/interface/IPlugin';
declare class App {
    plugins: Array<IPlugin>;
    commander: Icommander;
    eventEmitter: IEventEmitter;
    gluePluginStoreFactory: IGluePluginStoreFactory;
    constructor();
    addCommand: (runner: ICmd) => void;
    populatePlugins(localPlugins: Array<IPlugin>): Promise<void>;
    initPlugins(localPlugins: Array<IPlugin>): Promise<void>;
    destroyPlugins(): Promise<void>;
    initPluginInstances(): Promise<void>;
    destroyPluginInstances(): Promise<void>;
    doctor(): Promise<void>;
    dispatchEvent(eventName: string, ...args: any): void;
    addEventListener(eventName: string, callback?: () => void): void;
    createPluginInstance(plugin: IPlugin, instance: string, src: string, target: string): Promise<import("../../types/plugin/interface/IInstance").default>;
    getPluginByName(pluginName: string): IPlugin | null;
    getPlugins(): IPlugin[];
    getContainerTypePluginInstances(bottomToTop?: boolean): import("../../types/plugin/interface/IInstance").default[];
    watch(instancePath: string, pattern: string | string[], callback: WatchCallback): void;
    destroy(): Promise<void>;
    init(localPlugins: Array<IPlugin>): Promise<void>;
    initLocalCommands(): Promise<void>;
}
export default App;
