/// <reference types="node" />
import events from 'events';
import IPlugin from '../../types/plugin/interface/IPlugin';
import ICommander from '../../types/helpers/interface/ICommander';
import { IWatchCallback } from '../../types/app/interface/IWatcher';
import IProgramCallback from '../../types/helpers/interface/ICommandCallback';
import IGluePluginStoreFactory from '../../types/store/interface/IGluePluginStoreFactory';
export default class AppCLI {
    plugins: Array<IPlugin>;
    commander: ICommander;
    eventEmitter: events;
    gluePluginStoreFactory: IGluePluginStoreFactory;
    constructor();
    addCommand: (runner: IProgramCallback) => void;
    populatePlugins(localPlugins: IPlugin[]): Promise<void>;
    initPlugins(localPlugins: Array<IPlugin>): Promise<void>;
    destroyPlugins(): Promise<void>;
    initPluginInstances(): Promise<void>;
    destroyPluginInstances(): Promise<void>;
    doctor(): Promise<void>;
    dispatchEvent(eventName: string, ...args: any): void;
    addEventListener(eventName: string, callback?: (...args: any) => void): void;
    createPluginInstance(plugin: IPlugin, instance: string, src: string, target: string): Promise<import("../../types/plugin/interface/IInstance").default>;
    getPluginByName(pluginName: string): IPlugin | null;
    getPlugins(): IPlugin[];
    getContainerTypePluginInstances(bottomToTop?: boolean): import("../../types/plugin/interface/IInstance").default[];
    watch(cwd: string, pattern: string | string[], callback: IWatchCallback): void;
    write(cwd: string, instanceName: string): Promise<void>;
    destroy(): Promise<void>;
    init(localPlugins: Array<IPlugin>): Promise<void>;
    initLocalCommands(): Promise<void>;
}
