import AppCLI from '../../../helpers/lib/app';
import IProgramCallback from './ICommandCallback';
type ICommander = {
    init: () => void;
    addCommand: (app: AppCLI, cmd: IProgramCallback) => void;
    destroy: () => void;
};
export default ICommander;
