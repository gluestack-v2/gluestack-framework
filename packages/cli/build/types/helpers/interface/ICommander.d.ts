import IAppCLI from '../../app/interface/IAppCLI';
import ICmd from './ICommandCallback';
type Icommander = {
    init: () => void;
    addCommand: (app: IAppCLI, cmd: ICmd) => void;
    destroy: () => void;
};
export default Icommander;
