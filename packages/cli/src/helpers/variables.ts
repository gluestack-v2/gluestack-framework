import IVariables from '../types/helpers/interface/variables';

const variables = {} as IVariables;

// user's cli path
variables.cliPath = __dirname;

// setter & getter
variables.getVar = (variable) => variables[variable];
variables.setVar = (variable, data) => (variables[variable] = data);

export default variables;
