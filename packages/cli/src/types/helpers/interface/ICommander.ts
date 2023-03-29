import IAppCLI from '../../app/interface/IAppCLI';

export default interface commander {
	init: () => Promise<void>;
	addCommands: (app: IAppCLI) => Promise<void>;
	destroy: () => Promise<void>;
}
