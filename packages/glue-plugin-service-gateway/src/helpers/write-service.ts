import path from 'path';
import fs from 'fs';
import writeFile from './write-file';
import replaceHandlerNames from './replace-handler-names';
import getFileNameWithoutExtension from './get-file-name-without-ext';
import moleculerFunctionsServiceTemplateFunc from './functions-service-template';

function filePathExtension(filePath: string) {
  return filePath.split('.').pop() ?? '';
}

const eventsTemplate = (eventName: any, eventHandler: any) => {
  return `
  "${eventName}": {
    handler: ${eventHandler},
  },
`;
};

function camelCaseArray(arr: any) {
  // Join array elements with a space

  const joinedString = arr.join(' ');

  // Split joinedString by space and capitalize each word except the first
  const words = joinedString.split(' ');
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // Concatenate capitalized words
  const camelCaseString = words.join('');

  return camelCaseString;
}

const removeDashAndCamelCase = (str: any) => {
  const words = str.split('-');
  const camelCaseStr = words.reduce((acc: any, word: any, index: any) => {
    if (index === 0) {
      return word;
    }
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
    return acc + capitalizedWord;
  }, '');
  return camelCaseStr;
};

function getNestedFilePaths(dirPath: any, fileList: any = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // If the file is a directory, recursively call the function
      // to get nested file paths
      getNestedFilePaths(filePath, fileList);
    } else {
      // If the file is a regular file, add its path to the fileList
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Usage: Pass the directory path as an argument to the function
// Molecular service Actions/import statement
let moleculerActions: any = {};
let moleculerImportPaths = ``;

// Private service Actions/import statement
let privateMoleculerActions: any = {};
let privateMoleculerImportStatements = ``;

let molecularEvents = ``;
let privateMolecularEvents = ``;

let eventsImportPaths = ``;

const handlerTemplate = () => {
  return ` (ctx) => {
  const sdk = ServiceSDK.getInstance();
  const operation = ctx.params.operation;
  sdk.minioClient[operation](ctx.params.params, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Operation Completed successfully");
  });
},`;
};

const writeService = async (
  installationPath: string,
  functionPath: string,
  functionInstanceName: string
) => {
  const files = getNestedFilePaths(functionPath);

  files.forEach((functionFile: string, _index: number) => {
    const filePath = functionFile;
    if (
      ['json'].includes(filePathExtension(filePath)) ||
      filePath.includes('node_modules')
    ) {
      return;
    }

    if (filePath.endsWith('.map') || filePath === 'package.json') {
      return;
    }
    // Get Private Actions, events, importd
    if (filePath.includes('/private/')) {
      privateMoleculerActions = {
        ...privateMoleculerActions,
        ...getPrivateActions(installationPath, functionInstanceName, filePath)
          .actions,
      };

      privateMoleculerImportStatements =
        privateMoleculerImportStatements +
        getPrivateActions(installationPath, functionInstanceName, filePath)
          .importPaths;
      if (filePath.includes('/private/events/')) {
        let privateMolecularData = getEvents(
          getPrivatePath(filePath, installationPath)
        );
        privateMolecularEvents = privateMolecularData.events;
      }

      return;
    }

    // if (filePath.includes("/events/")) {
    //   molecularEvents += getEvents(getPaths(filePath, installationPath)).events;
    //   eventsImportPaths += getEvents(
    //     getPaths(filePath, installationPath)
    //   ).importPaths;
    //   return;
    // }
    // Get Actions
    moleculerActions = {
      ...moleculerActions,
      ...getActions(installationPath, functionInstanceName, filePath).actions,
    };
    // moleculerActions = { ...moleculerActions, ...storageRoute };

    moleculerImportPaths =
      moleculerImportPaths +
      getActions(installationPath, functionInstanceName, filePath).importPaths;
  });

  // Writing Molecular Actions and events for instance
  createService(
    moleculerActions,
    moleculerFunctionsServiceTemplateFunc(functionInstanceName),
    {
      actionImportPath: moleculerImportPaths,
      eventImportPath: eventsImportPaths,
    },
    path.join(
      installationPath,
      'services',
      `${functionInstanceName}.service.js`
    ),
    molecularEvents
  );

  // Writing Molecular Actions and events for private service
  createService(
    privateMoleculerActions,
    moleculerFunctionsServiceTemplateFunc('private'),
    { actionImportPath: privateMoleculerImportStatements, eventImportPath: '' },
    path.join(installationPath, 'services', `private.service.js`),
    privateMolecularEvents
  );

  // console.log('Updating API Gateway', installationPath, functionInstanceName);

  updateApiGateway(installationPath, functionInstanceName);
};

function removeExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
}

function getActions(
  installationPath: string,
  instanceName: string,
  filePath: string
) {
  let serviceAction: any = {};
  let functionImportStatement = ``;
  if (fs.existsSync(filePath)) {
    let finalPathArr = getPaths(filePath, installationPath);
    // const finalPath = getFileNameWithoutExtension(finalPathArr.functionPath);
    // Create actions object
    let action: any = {};
    action.rest = {
      method: 'POST',
      path: removeExtension(finalPathArr.functionPath),
    };

    action.handler = `(ctx) => {const context = new Context(ctx); return ${
      removeExtension(camelCaseArray(finalPathArr.funcPath)) + 'Handler'
    }(context);},`;

    serviceAction[removeExtension(finalPathArr.funcPath.join('.'))] = action;

    // Create Import Statement

    functionImportStatement = `const ${removeExtension(
      camelCaseArray(finalPathArr.funcPath)
    )}Handler = require("..${finalPathArr.functionPath}");`;

    functionImportStatement += '\n';
  }

  return {
    actions: serviceAction,
    importPaths: functionImportStatement,
    // events: serviceAction
  };
}

const getPrivateActions = (
  installationPath: string,
  instanceName: string,
  filePath: string
) => {
  let obj: any = {};
  // let privateEvents = ``;
  let functionImportStatement = ``;

  if (fs.existsSync(filePath)) {
    let finalPathArr = getPrivatePath(filePath, installationPath);

    // Create actions object
    let action: any = {};
    action.rest = {
      method: 'POST',
      path: finalPathArr.functionPath,
    };

    action.handler = `(ctx) => {const context = new Context(ctx); return ${
      removeExtension(camelCaseArray(finalPathArr.funcPath)) + 'Handler'
    }(context);},`;
    if (!filePath.includes('/events/'))
      obj[removeExtension(finalPathArr.funcPath.join('.'))] = action;
    // if (filePath.includes("/events/")) {
    //   privateEvents = getEvents(filePath, installationPath).events;
    // }
    // Create Import Statement

    functionImportStatement = `const ${removeExtension(
      camelCaseArray(
        finalPathArr.funcPath.map((str) => removeDashAndCamelCase(str))
      )
    )}Handler = require("..${finalPathArr.functionPath}");`;
    functionImportStatement += '\n';
  }
  return {
    actions: obj,
    importPaths: functionImportStatement,
  };
};

function getEvents(filePathData: any) {
  // let eventsPath = funcPath.filter((str) => str !== "events");
  // let res = getPaths(filePath, installationPath);
  let events = ``;
  const eventsIndex = filePathData.funcPath.indexOf('events');
  let eventNameIndex = filePathData.funcPath[1];
  // Check if the separator is present in the array
  if (eventsIndex !== -1) {
    eventNameIndex = filePathData.funcPath[eventsIndex + 1];
  }
  let functionImportStatement = ``;
  functionImportStatement = `const ${camelCaseArray(
    filePathData.funcPath
  )}Handler = require("..${filePathData.functionPath}");`;
  functionImportStatement += '\n';

  events = eventsTemplate(
    eventNameIndex,
    camelCaseArray(
      filePathData.funcPath.map((str: any) => removeDashAndCamelCase(str))
    ) + 'Handler'
  );

  return { events, importPaths: functionImportStatement };
}

function getWhitelist(apiGatewayPath: any) {
  const data = fs.readFileSync(apiGatewayPath, {
    encoding: 'utf-8',
  });
  const regex = /whitelist(.*)\n/gm;
  const matches: any = data.match(regex);
  // return;
  if (!matches) {
    let writeData = data.replace(
      '// ***Update Whitlisted services here***',
      `whitelist: [],`
    );
    fs.writeFileSync(apiGatewayPath, writeData);

    // const data1 = fs.readFileSync(apiGatewayPath, {
    //   encoding: 'utf-8',
    // });
    // const regex1 = /whitelist(.*)\n/gm;
    // const matches1: any = data1.match(regex1);

    return { whitelist: [], match: null, fileData: data };
  } else {
    const str = matches[0];
    const vals = str.match(/\[(.*?)\]/)[1];
    let whitelistArray = vals.split(',');

    // Remove extra quotes and trim whitespace
    whitelistArray = whitelistArray.map((item: any) =>
      item.replace(/"/g, '').trim()
    );
    // vals.map((val: any) => whitelistArray.push(val));

    return { whitelist: whitelistArray, match: matches[0], fileData: data };
  }
}

export function updateApiGateway(
  installationPath: string,
  instanceName: string
) {
  const apiGatewayPath = path.join(
    installationPath,
    'services',
    'api.service.js'
  );

  // const whitelistedArr = [`${instanceName}.**`];

  let { whitelist } = getWhitelist(apiGatewayPath);

  if (!whitelist.includes(`${instanceName}.**`)) {
    //   // FIX: Remove dbClient from whitelist
    whitelist = [...whitelist, `${instanceName}.**`];
    const data1 = fs.readFileSync(apiGatewayPath, {
      encoding: 'utf-8',
    });
    const regex1 = /whitelist(.*)\n/gm;
    const matches1: any = data1.match(regex1);
    const writeData = data1.replace(
      matches1[0],
      `whitelist: ${JSON.stringify(whitelist)},`
    );
    fs.writeFileSync(apiGatewayPath, writeData);
  }

  // console.log('hello here', whitelist);
  // const writeData = fileData.replace(match, JSON.stringify(whitelist));
  // fs.writeFileSync(apiGatewayPath, writeData);
}

async function createService(
  moleculerActions: any,
  moleculerFunctionsServiceTemplate: any,
  moleculerImportStatements: any,
  path: string,
  eventsData: string
) {
  let finalString = moleculerFunctionsServiceTemplate
    .replace(
      '// **---Add Actions Here---**',
      replaceHandlerNames(JSON.stringify(moleculerActions, null, 2))
    )
    .replace('/** Add handler here **/', handlerTemplate());

  finalString = finalString.replace(
    '// **---Add Events Here---**',
    eventsData + '// **---Add Events Here---**'
  );
  const uniqueStrings: any = [];
  moleculerImportStatements.actionImportPath
    .split('\n')
    .forEach((line: any) => {
      if (!uniqueStrings.includes(line)) {
        uniqueStrings.push(line);
      }
    });

  const outputString = uniqueStrings.join('\n');

  finalString = finalString.replace(
    '// **---Add Imports Here---**',
    outputString +
      moleculerImportStatements.eventImportPath +
      `const Context = require("../Context.ts");`
  );
  await writeFile(path, finalString);
}

function getPrivatePath(filePath: string, installationPath: string) {
  let functionPath = filePath.replace(installationPath, '');
  // functionPath = functionPath.split(".").slice(0, -1).join(".");
  let funcPath = functionPath.split('/');
  funcPath.splice(0, 2);
  funcPath = funcPath.filter((str) => str !== 'private');
  return { funcPath, functionPath };
}

function getPaths(filePath: string, installationPath: string) {
  // Dynamic route of a given action
  let functionPath = filePath.replace(installationPath, '');
  // functionPath = functionPath.split(".").slice(0, -1).join(".");
  // An Array of actions name for nested routes
  const funcPath = functionPath.split('/');
  funcPath.splice(0, 2);
  return { funcPath, functionPath };
}

export default writeService;
