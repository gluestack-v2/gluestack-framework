import IProgram from './IProgram';
import IEventEmitter from 'events';
import IPlugin from '../../plugin/interface/IPlugin';
import ICmd from '../../helpers/interface/ICommandCallback';
import Icommander from '../../helpers/interface/ICommander';
import IGluePluginStoreFactory from '../../store/interface/IGluePluginStoreFactory';
import IManagesInstances from '../../plugin/interface/IManagesInstances';
import IInstance from '../../plugin/interface/IInstance';

export type WatchCallback = (event: string, path: string) => void;

export default interface IAppCLI {
	plugins: Array<IPlugin&IManagesInstances>;
	commander : Icommander;
	eventEmitter: IEventEmitter;
	gluePluginStoreFactory: IGluePluginStoreFactory;
	
	addCommand(runner: ICmd): void;

	doctor(): any;

	dispatchEvent(eventName: string, args: any): void;

	addEventListener(eventName: string, callback: () => {}): void;

	createPluginInstance(
		plugin: IPlugin,
		instanceName: string,
		src: string,
		target: string
	): any;

	getPluginByName(pluginName: string): any;

	getPlugins(): IPlugin[];

	getContainerTypePluginInstances(
		bottomToTop?: boolean
	): IInstance[];

	watch(instancePath: string,
		pattern: string | string[],
		callback: WatchCallback
	): void;

	destroy(): void;

	init(localPlugins: any): Promise<void>;
}
