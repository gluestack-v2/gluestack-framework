import AppCLI from '../../../helpers/lib/app';

export default interface IServiceProvider {
	app: AppCLI;
	init(): any;
	destroy(): any;
}
