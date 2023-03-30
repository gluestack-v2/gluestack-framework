declare const commands: () => ((program: import("../types/app/interface/IProgram").default, app: import("../types/app/interface/IAppCLI").default) => Promise<void>)[];
export default commands;
