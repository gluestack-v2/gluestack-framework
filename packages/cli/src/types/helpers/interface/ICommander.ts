import IAppCLI from '../../app/interface/IApp';
import ICmd from './ICommandCallback';

type Icommander = {
	init: () => void;
	addCommand: (app: IAppCLI, cmd: ICmd) => void;
	destroy: () => void;
}
export default Icommander;