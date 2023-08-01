import AppCLI from '../helpers/lib/app';

import IPlugin, {
	RunningPlatforms,
} from '../types/plugin/interface/IPlugin';
import IInstance from '../types/plugin/interface/IInstance';
import IGluePluginStore from '../types/store/interface/IGluePluginStore';
import path, { join } from 'path';

export default abstract class BaseGluestackPlugin implements IPlugin {
	app: AppCLI;
	instances: IInstance[];
	type: 'stateless' | 'stateful' | 'devonly' = 'stateless';
	gluePluginStore: IGluePluginStore;
	runningPlatforms: RunningPlatforms = ['local', 'docker'];
	pluginEnvironment: 'server' | 'client' = 'server';

	constructor(app: AppCLI, gluePluginStore: IGluePluginStore) {
		this.app = app;
		this.instances = [];
		this.type = 'stateless';
		this.gluePluginStore = gluePluginStore;
	}

	abstract init(): void;
	abstract destroy(): void;
	abstract getVersion(): string;
	abstract getName(): string;
	abstract runPostInstall(instanceName: string, target: string): void;
	abstract createInstance(
		key: string,
		gluePluginStore: IGluePluginStore,
		installationPath: string
	): IInstance;

	getType(): 'stateless' | 'stateful' | 'devonly' {
		return this.type;
	}

	getTemplateFolderPath(): string {
		return join(this.getPackagePath(), 'template');
	}

	getPackagePath(): string {
		const packageJSONPath = require.resolve(
			path.join(this.getName(), 'package.json')
		);
		const packagePath = path.dirname(packageJSONPath);
		return packagePath;
	}

	getInstallationPath(target: string): string {
		return join(target);
	}

	getInstances(): IInstance[] {
		return this.instances;
	}

	getPluginEnvironment() {
		return this.pluginEnvironment;
	}

	async build(): Promise<void> {
		const instances: Array<IInstance> = this.getInstances();

		for await (const instance of instances) {
			await instance.build();
		}
	}

	async watch(callback: Function): Promise<void> {
		const instances: Array<IInstance> = this.getInstances();
		for await (const instance of instances) {
			if (instance.watch) {
				await instance.watch((event: string, path: string) => {
					// use this for debuggin
					if (callback) {
						callback(event, path, this.pluginEnvironment);
					}
				});
			}
		}
	}
}
