interface variables {
    cliPath: string;
    getVar: (variable: string) => string;
    setVar: (variable: string, data: string) => void;
    [key: string]: any;
}
export default variables;
