import GlobalServiceClass from './GlobalServiceClass';
import { applyPatches } from 'immer';
let rootObject = {};

globalService.setRootState((draft: any) => {
  draft.age = 20;
});

const patches = globalService.getGlobalPatches();

rootObject = applyPatches(rootObject, patches);

console.log(rootObject); // results in { age: 20 }
