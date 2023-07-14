/* eslint-disable prettier/prettier */
import { join, relative } from 'path';

import AppCLI from '../helpers/lib/app';
import IPlugin from './plugin/interface/IPlugin';
import IInstance from './plugin/interface/IInstance';
import IGlueStorePlugin from './store/interface/IGluePluginStore';
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from '../constants/gluestack.v2';
import { SEAL_SERVICES_PATH } from '../constants/seal';

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

	getDockerfile(): string {
		return `${this._workspacePath}/Dockerfile`;
	}

	getSealServicefile(): string {
		return `${this._workspacePath}/seal.service.yaml`;
	}

	getDestinationPath(): string {
		return join(
			process.cwd(),
			GLUE_GENERATED_SEAL_SERVICES_PATH,
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
			GLUE_GENERATED_SEAL_SERVICES_PATH,
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
		let envData: string = await readEnvFile(envPath);

		let envDataArray = envData ? envData.split('\n') : [];
		let envObjectsArray = envDataArray.map((envDataItem: string) => {
			if (!envDataItem) return;
			return envDataItem.split('=');
		});

		let envDataFiltered: any = envObjectsArray.filter(
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
		let filteredObject = Object.fromEntries(envDataFiltered);
		return filteredObject;
	}

	generateEnvDataFromObject(envObject: any) {
		let envDataArray = Object.entries(envObject);
		let envDataString = envDataArray
			.map((envDataItem) => {
				return `${envDataItem[0]}=${envDataItem[1]}`;
			})
			.join('\n');
		return envDataString;
	}

	async generateEnvFiles() {
		const rootEnvPath = join(process.cwd(), '.env');
		//@ts-ignore
		let pluginEnv = this.callerPlugin.pluginEnvironment;
		let filteredEnv = await this.filterEnvData(
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
		// seal init and seal service add in the services folder
		if (!fileExistsSync(join(SEAL_SERVICES_PATH, 'bolt.yaml'))) {
			const sealInit = spawnSync('sh', [
				'-c',
				`cd ${SEAL_SERVICES_PATH} && bolt init`,
			]);

			if (sealInit.status !== 0) {
				console.error(`Command failed with code ${sealInit.status}`);
			}
			// eslint-disable-next-line no-console
			console.log(sealInit.stdout.toString());
			console.error(sealInit.stderr.toString());
		}

		const sealAddService = spawnSync('sh', [
			'-c',
			`cd ${GLUE_GENERATED_SEAL_SERVICES_PATH} && bolt service:add  ${this.getName()} ./${this.getName()}/src/${this.getName()}`,
		]);

		if (sealAddService.status !== 0) {
			console.error(
				`Command failed with code ${sealAddService.status}`
			);
		}

		// eslint-disable-next-line no-console
		console.log(sealAddService.stdout.toString());
		console.error(sealAddService.stderr.toString());
	}

	async boltUp(servicePlatform: string) {
		// seal init and seal service add in the services folder
		const sealInit = spawnSync('sh', [
			'-c',
			`cd ${GLUE_GENERATED_SEAL_SERVICES_PATH} && bolt service:up ${this.getName()} --service-runner ${servicePlatform}`,
		]);

		if (sealInit.status !== 0) {
			console.error(`Command failed with code ${sealInit.status}`);
		}
		// eslint-disable-next-line no-console
		console.log(sealInit.stdout.toString());
		console.error(sealInit.stderr.toString());
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
