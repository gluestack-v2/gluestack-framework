import IPlugin from './IPlugin';
import IApp from '../../app/interface/IAppCLI';
import IGlueStorePlugin from '../../store/interface/IGluePluginStore';

export default interface IInstance {
	app: IApp;
	name: string;
	callerPlugin: IPlugin;
	gluePluginStore: IGlueStorePlugin;
	installationPath: string;
	isOfTypeInstance: boolean;
	init(): any;
	destroy(): any;
	getName(): string;
	getCallerPlugin(): IPlugin;
	getInstallationPath(): string;
	watch(): void;
}
