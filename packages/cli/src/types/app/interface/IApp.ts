import IProgram from './IProgram';
import IPlugin from '../../plugin/interface/IPlugin';
import IHasContainerController from '../../plugin/interface/IHasContainerController';

type WatchCallback = (event: string, path: string) => void;

export default interface IApp {
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
