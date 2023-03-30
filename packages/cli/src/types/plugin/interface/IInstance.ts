import IPlugin from './IPlugin';
import IGlueStorePlugin from '../../store/interface/IGluePluginStore';
import IAppCLI from '../../app/interface/IAppCLI';

export default interface IInstance {
	app: IAppCLI;
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
