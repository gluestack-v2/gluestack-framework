import { globalServiceMap } from '../constant/globalServiceMap';
import { createTerminal } from '../helpers/createTerminal';
import DataStore from '../store/DataStore';
const dataStore = DataStore.getInstance();
export const runServices = async () => {
  const mainTerminal = createTerminal('main');
  globalServiceMap.set('main', mainTerminal);
  mainTerminal.on('data', (data: any) => {
    // const newData = removeANSIEscapeCodes(data);
    dataStore.produce((draft: any) => {
      draft.runners.main.output = draft.runners.main.output + data;
    });
  });
};

export function ansiRegex({ onlyFirst = false } = {}) {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
  ].join('|');

  return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

function removeANSIEscapeCodes(text: string) {
  const ansiEscapeRegex = ansiRegex();
  return text.replace(ansiEscapeRegex, '');
}
runServices();
