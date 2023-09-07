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
	_destinationPath: string;
	_sourcePath: string;
	_workspacePath: string;
	_instanceType: 'service' | 'package' | 'none';

	init(): any;
	destroy(): any;
	getName(): string;
	getCallerPlugin(): IPlugin;

	build(): Promise<void>;
	prepare(): Promise<void>;

	watch(callback?: Function): Promise<void>;

	updateSourcePackageJSON(): Promise<void>;
	updateDestinationPackageJSON(): Promise<void>;
	updateRootPackageJSONWithSourcePath(): Promise<void>;
	updateRootPackageJSONWithDestinationPath(): Promise<void>;
	updateWorkspacePackageJSON(): Promise<void>;
}
