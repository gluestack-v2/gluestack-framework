
export type RunningPlatform = 'local' | 'docker';
export type RunningPlatforms = Array<RunningPlatform>;
export default interface IProvider {
	providers: IProvider[];
	// lifecycle
	init(): any;
	destroy(): any;

	getName(): string;
	getVersion(): string;
	getInstances(): IProvider[];
}
