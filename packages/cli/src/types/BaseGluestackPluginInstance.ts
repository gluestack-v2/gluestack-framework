import { join } from 'path';

import AppCLI from '../helpers/lib/app';
import IPlugin from './plugin/interface/IPlugin';
import IInstance from './plugin/interface/IInstance';
import IGlueStorePlugin from './store/interface/IGluePluginStore';
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from '../constants/gluestack.v2';
import { SEAL_SERVICES_PATH } from '../constants/seal';

import { Workspaces } from "@gluestack/helpers";
import { writeFile, rewriteFile } from '../helpers/file';
import { spawnSync } from 'child_process';

export default abstract class BaseGluestackPluginInstance
	implements IInstance {
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
			"src",
			this.getName()
		);
	}

	getSourcePath(): string {
		return join(process.cwd(), this.getName());
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

	async updateInstancePackageJSON() {
		// update package.json'S name index with the new instance name
		const pluginPackage = `${this._destinationPath}/package.json`;
		await rewriteFile(pluginPackage, this.getName(), "INSTANCENAME");
	}

	async updateRootPackageJSON() {
		// update root package.json's workspaces with the new instance name
		const rootPackage: string = `${process.cwd()}/package.json`;
		await Workspaces.append(rootPackage, this._destinationPath);
	}

	async updateWorkspacePackageJSON() {
		// // add package.json with workspaces
		const packageFile: string = join(this._workspacePath, "package.json");
		const packageContent: any = {
			name: this.getName(),
			private: true,
			workspaces: [this.getName(), "packages/**/src"],
			scripts: {
				"install:all": "npm install --workspaces --if-present",
				dev: "npm run dev --workspace @project/" + this.getName(),
			},
		};

		await writeFile(packageFile, JSON.stringify(packageContent, null, 2));
	}


	async sealInit() {
		// seal init and seal service add in the services folder
		const sealInit = spawnSync("sh", [
			"-c",
			`cd ${SEAL_SERVICES_PATH} && seal init`,
		]);

		if (sealInit.status !== 0) {
			console.error(`Command failed with code ${sealInit.status}`);
		}

		console.log(sealInit.stdout.toString());
		console.error(sealInit.stderr.toString());

		const sealAddService = spawnSync("sh", [
			"-c",
			`cd ${SEAL_SERVICES_PATH} && seal service:add ${this.getName()} ./${this.getName()}/src`,
		]);

		if (sealAddService.status !== 0) {
			console.error(`Command failed with code ${sealAddService.status}`);
		}

		console.log(sealAddService.stdout.toString());
		console.error(sealAddService.stderr.toString());
	}
}