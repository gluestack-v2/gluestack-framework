import { Command } from "commander";
import IAppCLI from "../../app/interface/IAppCLI";

type ICmd = (program: Command, app: IAppCLI) => void;

export default ICmd;