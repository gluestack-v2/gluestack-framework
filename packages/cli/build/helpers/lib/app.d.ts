/// <reference types="node" />
import IEventEmitter from 'events';
import Icommander from '../../types/helpers/interface/ICommander';
import IGluePluginStoreFactory from '../../types/store/interface/IGluePluginStoreFactory';
import ICmd from '../../types/helpers/interface/ICommandCallback';
import IAppCLI, { WatchCallback } from '../../types/app/interface/IAppCLI';
import IGSPlugin from '../../types/plugin/interface/IGSPlugin';
declare class App implements IAppCLI {
    plugins: Array<IGSPlugin>;
    commander: Icommander;
    eventEmitter: IEventEmitter;
    gluePluginStoreFactory: IGluePluginStoreFactory;
    constructor();
    addCommand: (runner: ICmd) => void;
    populatePlugins(localPlugins: Array<IGSPlugin>): Promise<void>;
    initPlugins(localPlugins: Array<IGSPlugin>): Promise<void>;
    destroyPlugins(): Promise<void>;
    initPluginInstances(): Promise<void>;
    destroyPluginInstances(): Promise<void>;
    doctor(): Promise<void>;
    dispatchEvent(eventName: string, ...args: any): void;
    addEventListener(eventName: string, callback?: () => void): void;
    createPluginInstance(plugin: IGSPlugin, instance: string, src: string, target: string): Promise<import("../../types/plugin/interface/IInstance").default>;
    getPluginByName(pluginName: string): IGSPlugin | null;
    getPlugins(): IGSPlugin[];
    getContainerTypePluginInstances(bottomToTop?: boolean): import("../../types/plugin/interface/IInstance").default[];
    watch(instancePath: string, pattern: string | string[], callback: WatchCallback): void;
    destroy(): Promise<void>;
    init(localPlugins: Array<IGSPlugin>): Promise<void>;
    initLocalCommands(): Promise<void>;
}
export default App;
