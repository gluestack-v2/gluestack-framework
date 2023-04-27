import IPlugin from './IPlugin';
import IGlueStorePlugin from '../../store/interface/IGluePluginStore';
import AppCLI from '../../../helpers/lib/app';

export default interface IInstance {
	app: AppCLI;
	name: string;
	callerPlugin: IPlugin;
	gluePluginStore: IGlueStorePlugin;
	installationPath?: string;
	isOfTypeInstance: boolean;

	init(): any;
	destroy(): any;
	getName(): string;
	getCallerPlugin(): IPlugin;
	getInstallationPath(): string;
	watch(): Promise<void>;

	// seal
	getDockerfile?: () => string;
	getSealServicefile(): string;
}
