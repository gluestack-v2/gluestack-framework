import IServiceProvider from '../types/plugin/interface/IServiceProvider';

export default abstract class ServiceProvider
	implements IServiceProvider
{
	constructor() {}
	getInstance() {
		return this;
	}

	abstract init(): void;
	abstract destroy(): void;
}
