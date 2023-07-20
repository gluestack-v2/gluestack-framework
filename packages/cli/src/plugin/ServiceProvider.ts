import IServiceProvider from '../types/plugin/interface/IServiceProvider';

export default abstract class ServiceProvider
	implements IServiceProvider
{
	constructor() {}

	abstract init(): void;
	abstract destroy(): void;
}
