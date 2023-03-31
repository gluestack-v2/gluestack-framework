import { Command } from "commander";

import App from "../../../helpers/lib/app";

type ICmd = (program: Command, app: App) => void;

export default ICmd;