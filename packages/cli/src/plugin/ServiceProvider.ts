import IServiceProvider from '../types/plugin/interface/IServiceProvider';

export default abstract class ServiceProvider
	implements IServiceProvider
{
	constructor() {}
	getProvider(): any {
		return this;
	}

	abstract init(): void;
	abstract destroy(): void;
}
