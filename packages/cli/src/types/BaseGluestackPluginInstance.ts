import { join } from 'path';

import AppCLI from '../helpers/lib/app';
import IPlugin from './plugin/interface/IPlugin';
import IInstance from './plugin/interface/IInstance';
import IGlueStorePlugin from './store/interface/IGluePluginStore';
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from '../constants/gluestack.v2';

export default abstract class BaseGluestackPluginInstance
	implements IInstance
{
	app: AppCLI;
	name: string;
	callerPlugin: IPlugin;
	isOfTypeInstance: boolean = false;
	gluePluginStore: IGlueStorePlugin;
	installationPath: string;

	constructor(
		app: AppCLI,
		callerPlugin: IPlugin,
		name: string,
		gluePluginStore: IGlueStorePlugin,
		installationPath: string
	) {
		this.app = app;
		this.name = name;
		this.callerPlugin = callerPlugin;
		this.gluePluginStore = gluePluginStore;
		this.installationPath = installationPath;
	}

	abstract init(): void;
	abstract destroy(): void;

	async build(): Promise<void> {
		//
	}

	async watch(callback?: Function): Promise<void> {
		//
	}

	getName(): string {
		return this.name;
	}

	getCallerPlugin(): IPlugin {
		return this.callerPlugin;
	}

	getInstallationPath(): string {
		return this.installationPath;
	}

	getDockerfile(): string {
		return `${this.getInstallationPath()}/Dockerfile`;
	}

	getSealServicefile(): string {
		return `${this.getInstallationPath()}/seal.service.yaml`;
	}

	getGeneratedPath(name: any) {
    return join(
      GLUE_GENERATED_SEAL_SERVICES_PATH,
      name,
      "src"
    );
  }

	getSourcePath(): string {
		return join(process.cwd(), this.getName());
	}

	getDestinationPath(): string {
		return join(process.cwd(), this.getGeneratedPath(this.getName()));
	}

	public get _sourcePath() : string {
		return this.getSourcePath();
	}

	public get _destinationPath() : string {
		return this.getDestinationPath();
	}
}
