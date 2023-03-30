/// <reference types="node" />
import IEventEmitter from 'events';
import ICmd from '../../helpers/interface/ICommandCallback';
import Icommander from '../../helpers/interface/ICommander';
import IGluePluginStoreFactory from '../../store/interface/IGluePluginStoreFactory';
import IInstance from '../../plugin/interface/IInstance';
import IGSPlugin from '../../plugin/interface/IGSPlugin';
export type WatchCallback = (event: string, path: string) => void;
export default interface IAppCLI {
    plugins: Array<IGSPlugin>;
    commander: Icommander;
    eventEmitter: IEventEmitter;
    gluePluginStoreFactory: IGluePluginStoreFactory;
    addCommand(runner: ICmd): void;
    doctor(): any;
    dispatchEvent(eventName: string, args: any): void;
    addEventListener(eventName: string, callback: () => {}): void;
    createPluginInstance(plugin: IGSPlugin, instanceName: string, src: string, target: string): any;
    getPluginByName(pluginName: string): any;
    getPlugins(): IGSPlugin[];
    getContainerTypePluginInstances(bottomToTop?: boolean): IInstance[];
    watch(instancePath: string, pattern: string | string[], callback: WatchCallback): void;
    destroy(): void;
    init(localPlugins: any): Promise<void>;
}
