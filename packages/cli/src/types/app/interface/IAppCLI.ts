import IProgram from './IProgram';
import IPlugin from '../../plugin/interface/IPlugin';
import IHasContainerController from '../../plugin/interface/IHasContainerController';
import IManagesInstances from '../../plugin/interface/IManagesInstances';

type WatchCallback = (event: string, path: string) => void;

export default interface IAppCLI {

	plugins:Array<IPlugin>;

	instances:Array<IManagesInstances>;


	addCommand(command: (program: any) => void): any;

	doctor(): any;

	dispatchEvent(eventName: string, args: any): any;

	addEventListener(eventName: string, callback: any): any;

	createPluginInstance(
		plugin: IPlugin,
		instanceName: string,
		src: string,
		target: string
	): any;

	getPluginByName(pluginName: string): any;

	getContainerTypePluginInstances(
		bottomToTop?: boolean,
		returnWithTree?: boolean
	): (IPlugin & IHasContainerController)[];

	watch(pattern: string | string[], callback: WatchCallback): void;
}
