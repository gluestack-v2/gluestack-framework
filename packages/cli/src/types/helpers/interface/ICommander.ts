import App from '../../../helpers/lib/app';
import ICmd from './ICommandCallback';

type Icommander = {
	init: () => void;
	addCommand: (app: App, cmd: ICmd) => void;
	destroy: () => void;
}
export default Icommander;
