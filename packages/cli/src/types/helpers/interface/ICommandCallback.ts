import { Command } from 'commander';
import AppCLI from '../../../helpers/lib/app';

type ICommandCallback = (program: Command, app: AppCLI) => void;

export default ICommandCallback;
