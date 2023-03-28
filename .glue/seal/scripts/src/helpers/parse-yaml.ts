import { parse, YAMLParseError, YAMLWarning } from 'yaml';
import { exitWithMsg } from './exit-with-msg';
import { readfile } from './fs-readfile';

type ValidateType = 'service' | 'all';

export const parseYAML = async (filepath: string, type: ValidateType = 'service'): Promise<any> => {
  const content: string = await readfile(filepath);

  try {
    const parsed: any = parse(content);
    return parsed;
  } catch (error) {
    if (
      error instanceof YAMLParseError || error instanceof YAMLWarning
    ) {
      await exitWithMsg({...error});
    }
    return `> ${filepath} is not a valid yaml file`;
  }
};
