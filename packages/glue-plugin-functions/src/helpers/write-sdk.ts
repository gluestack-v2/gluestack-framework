import path from 'path';
import fs, { readFileSync } from 'fs';
import { writeFile } from '@gluestack/helpers';
import writeSDKFunction from './write-sdk-function';
import getFileNameWithoutExtension from '@gluestack-v2/framework-cli/build/helpers/file/get-file-name-without-ext';
function filePathExtension(filePath: string) {
  return filePath.split('.').pop() ?? '';
}
const functionsMap: any = {};

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

const createFunctionFromPath = (path: string, value: any, sdkFunction: any) => {
  const pathArr = path.split('/');
  // console.log(sdkFunction);
  const obj = {};
  let current: any = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    if (pathArr[i] !== '') {
      // if (i == pathArr.length - 1) {
      //   console.log(i, "in if");
      //   current[pathArr[i]] = sdkFunction;
      // } else {

      current[pathArr[i]] = {};
      // }
      current = current[pathArr[i]];
    }
  }

  current[pathArr[pathArr.length - 1]] = '****' + path + '****';
  functionsMap['****' + path + '****'] = sdkFunction;

  return obj;
};

const deepMerge = (obj1: any, obj2: any) => {
  const output = { ...obj1 };
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (
        typeof obj2[key] === 'object' &&
        obj1.hasOwnProperty(key) &&
        typeof obj1[key] === 'object'
      ) {
        output[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        output[key] = obj2[key];
      }
    }
  }
  return output;
};

const writeSDK = async (
  packagePath: string,
  installationPath: string,
  sdkPath: string,
  ignoredPaths: string[],
  instanceName: string
) => {
  let obj = {};
  const packageSdkSrcIndex = path.join(packagePath, 'src', 'index.ts');
  const files = getNestedFilePaths(installationPath);
  let finalString = ``;
  files.forEach((functionFile: string, _index: number) => {
    const filePath = functionFile;

    if (
      ['json'].includes(filePathExtension(filePath)) ||
      filePath.includes('node_modules')
    ) {
      return;
    }

    for (let i = 0; i < ignoredPaths.length; i++) {
      if (filePath.includes('/' + ignoredPaths[i] + '/')) {
        return;
      }
    }
    // console.log(filePath, 'filePath>>>>>>>');
    const functionName = getFileNameWithoutExtension(filePath);
    // HACK: This is a hack to get the function path
    let functionPath = filePath.replace(installationPath, '');
    // let functionPath = filePath.replace(installationPath, '');

    functionPath = functionPath.split('.').slice(0, -1).join('.');
    // console.log(functionPath, 'functionPath', functionName, 'functionName');
    // console.log(
    //   installationPath,
    //   'installationPath>>>>>>.',
    //   packagePath,
    //   'packagePath>>>>>>.'
    // );
    const functionCodeString = fs.readFileSync(filePath, 'utf8');

    const regex = /const\s*\{\s*([^}]+)\s*\}\s*=\s*ctx.params\s*;/;
    const matches = functionCodeString.match(regex);
    let params: any = [];
    if (matches && matches[1]) {
      params = matches[1].split(/\s*,\s*/);
    } else {
      params = [];
      console.error(
        'NO MATCHES FOR PARMAS IN THE PROVIDED FUNCTION ' + functionName
      );
    }
    // console.log(ign);

    const sdkFunction = writeSDKFunction(instanceName, params, functionPath);
    // console.log(createFunctionFromPath(functionPath, {}, sdkFunction));

    obj = {
      ...obj,
      ...deepMerge(obj, createFunctionFromPath(functionPath, {}, sdkFunction)),
    };
    // console.log(obj, 'OBJJJJJ', Object.keys(obj));

    // finalString = JSON.stringify(obj);
    // finalString = finalString.substring(1, finalString.length - 1);
    // console.log(functionsMap, 'functionsMap');
    // Object.keys(functionsMap).map((key: any) => {
    //   finalString = finalString.replace(`"${key}"`, functionsMap[key]);
    // });
    // console.log(finalString, 'finalString');

    // sdkFunction += sdkFunction + '\n';
  });
  Object.keys(obj).map((key: any) => {
    // console.log(JSON.stringify(obj[key]), 'obj[key]');
    const functionString = `${key}=`;
    if (typeof obj[key] === 'string') {
      if (!finalString.includes(functionString + obj[key])) {
        finalString = finalString + functionString + obj[key];
      }
    } else {
      if (!finalString.includes(functionString + JSON.stringify(obj[key]))) {
        finalString = finalString + functionString + JSON.stringify(obj[key]);
      }
    }

    // finalString=finalString+
  });
  // console.log(functionsMap);

  Object.keys(functionsMap).map((key: any) => {
    finalString = finalString.replace(`"${key}"`, functionsMap[key]);
    finalString = finalString.replace(`'${key}'`, functionsMap[key]);
    finalString = finalString.replace(`${key}`, functionsMap[key]);
  });

  const sdkFileContent = readFileSync(
    path.join(sdkPath, 'src', 'index.ts')
  ).toString();
  // console.log(finalString, 'SDK FILE CONTENTNNNNN');
  // Create SDK index file with all the functions
  await writeFile(
    packageSdkSrcIndex,
    sdkFileContent.replace(
      '// **---Functions will be added after this---**',
      finalString
    )
  );
};
export default writeSDK;
