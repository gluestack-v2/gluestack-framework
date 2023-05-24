import { join, relative } from 'path';

import AppCLI from '../helpers/lib/app';
import IServiceProvider from './plugin/interface/IServiceProvider';

export default abstract class ServiceProvider
	implements IServiceProvider {
	app: AppCLI;

	constructor(
		app: AppCLI,
	) {
		this.app = app;
	}

	abstract init(): void;
	abstract destroy(): void;
}
