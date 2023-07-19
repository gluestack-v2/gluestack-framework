import { join, relative } from 'path';

import AppCLI from '../helpers/lib/app';
import IPlugin from './plugin/interface/IPlugin';
import IInstance from './plugin/interface/IInstance';
import IGlueStorePlugin from './store/interface/IGluePluginStore';
import { GLUE_GENERATED_SERVICES_PATH } from '../constants/gluestack.v2';
import { BOLT_SERVICES_PATH } from '../constants/gluestack.v2';

import { Workspaces } from '@gluestack/helpers';
import {
	writeFile,
	fileExistsSync,
	readEnvFile,
} from '../helpers/file';
import { spawnSync } from 'child_process';

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

	getName(): string {
		return this.name;
	}

	getCallerPlugin(): IPlugin {
		return this.callerPlugin;
	}

	getDestinationPath(): string {
		return join(
			process.cwd(),
			GLUE_GENERATED_SERVICES_PATH,
			this.getName(),
			'src',
			this.getName()
		);
	}

	getPluginEnvironment() {
		// @ts-ignore
		return this.callerPlugin.getPluginEnvironment();
	}

	getSourcePath(): string {
		return join(
			process.cwd(),
			this.getPluginEnvironment(),
			this.getName()
		);
	}

	getWorkspacePath(): string {
		return join(
			process.cwd(),
			GLUE_GENERATED_SERVICES_PATH,
			this.getName(),
			'src'
		);
	}

	public get _workspacePath(): string {
		return this.getWorkspacePath();
	}

	public get _sourcePath(): string {
		return this.getSourcePath();
	}

	public get _destinationPath(): string {
		return this.getDestinationPath();
	}

	async updateSourcePackageJSON() {
		// update package.json'S name index with the new instance name
		this.app.updateNameInPackageJSON(
			this._sourcePath,
			this.getName()
		);
	}

	async updateDestinationPackageJSON() {
		// update package.json'S name index with the new instance name
		this.app.updateNameInPackageJSON(
			this._destinationPath,
			this.getName()
		);
	}

	async filterEnvData(
		envPath: string,
		pluginEnv: 'server' | 'client'
	) {
		const envData: string = await readEnvFile(envPath);

		const envDataArray = envData ? envData.split('\n') : [];
		const envObjectsArray = envDataArray.map(
			(envDataItem: string) => {
				if (!envDataItem) return;
				return envDataItem.split('=');
			}
		);

		const envDataFiltered: any = envObjectsArray.filter(
			(envDataItem: string[] | undefined) => {
				if (envDataItem) {
					if (pluginEnv === 'client') {
						return !envDataItem[0].startsWith('SERVER_');
					} else {
						return !envDataItem[0].startsWith('CLIENT_');
					}
				}
			}
		);
		const filteredObject = Object.fromEntries(envDataFiltered);
		return filteredObject;
	}

	generateEnvDataFromObject(envObject: any) {
		const envDataArray = Object.entries(envObject);
		const envDataString = envDataArray
			.map((envDataItem) => {
				return `${envDataItem[0]}=${envDataItem[1]}`;
			})
			.join('\n');
		return envDataString;
	}

	async generateEnvFiles() {
		const rootEnvPath = join(process.cwd(), '.env');
		//@ts-ignore
		const pluginEnv = this.callerPlugin.pluginEnvironment;
		const filteredEnv = await this.filterEnvData(
			rootEnvPath,
			pluginEnv
		);
		await writeFile(
			join(this._workspacePath, '.env'),
			this.generateEnvDataFromObject(filteredEnv)
		);
	}

	async updateRootPackageJSONWithSourcePath() {
		// update root package.json's workspaces with the new instance name
		const rootPackage: string = `${process.cwd()}/package.json`;
		await Workspaces.append(
			rootPackage,
			relative(process.cwd(), this._sourcePath)
		);
	}

	async updateRootPackageJSONWithDestinationPath() {
		const rootPackage: string = `${process.cwd()}/package.json`;
		await Workspaces.append(
			rootPackage,
			relative(process.cwd(), this._destinationPath)
		);
	}

	async updateWorkspacePackageJSON() {
		// // add package.json with workspaces
		const packageFile: string = join(
			this._workspacePath,
			'package.json'
		);
		const packageContent: any = {
			name: this.getName(),
			private: true,
			workspaces: [this.getName(), 'packages/**'],
			scripts: {
				'install:all': 'npm install --workspaces --if-present',
				build: 'npm run build --workspaces --if-present',
				dev: 'npm run dev --workspace @project/' + this.getName(),
			},
		};

		await writeFile(
			packageFile,
			JSON.stringify(packageContent, null, 2)
		);
	}

	async boltInit() {
		// bolt init and bolt service add in the services folder
		if (!fileExistsSync(join(BOLT_SERVICES_PATH, 'bolt.yaml'))) {
			const boltInit = spawnSync('sh', [
				'-c',
				`cd ${BOLT_SERVICES_PATH} && bolt init`,
			]);

			if (boltInit.status !== 0) {
				console.error(`Command failed with code ${boltInit.status}`);
			}
			// eslint-disable-next-line no-console
			console.log(boltInit.stdout.toString());
			console.error(boltInit.stderr.toString());
		}

		const boltAddService = spawnSync('sh', [
			'-c',
			`cd ${GLUE_GENERATED_SERVICES_PATH} && bolt service:add  ${this.getName()} ./${this.getName()}/src/${this.getName()}`,
		]);

		if (boltAddService.status !== 0) {
			console.error(
				`Command failed with code ${boltAddService.status}`
			);
		}

		// eslint-disable-next-line no-console
		console.log(boltAddService.stdout.toString());
		console.error(boltAddService.stderr.toString());
	}

	async boltUp(servicePlatform: string) {
		// bolt init and bolt service add in the services folder
		const boltInit = spawnSync('sh', [
			'-c',
			`cd ${GLUE_GENERATED_SERVICES_PATH} && bolt service:up ${this.getName()} --service-runner ${servicePlatform}`,
		]);

		if (boltInit.status !== 0) {
			console.error(`Command failed with code ${boltInit.status}`);
		}
		// eslint-disable-next-line no-console
		console.log(boltInit.stdout.toString());
		console.error(boltInit.stderr.toString());
	}

	async buildBeforeWatch() {
		if (!(await fileExistsSync(this._destinationPath))) {
			try {
				await this.build();
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log('>> Instance does not exits:', this.getName());
				return;
			}
		}
	}
	async watch(callback?: Function): Promise<void> {
		await this.buildBeforeWatch();
		this.app.watch(
			this._sourcePath,
			'',
			async (event: string, path: string) => {
				if (callback) {
					callback(event, path);
				}
			}
		);
	}

	public get _instanceType(): any {
		return this._destinationPath.includes('packages')
			? 'package'
			: this._destinationPath.includes('services')
			? 'service'
			: 'none';
	}
}
