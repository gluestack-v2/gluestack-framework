import { parse, YAMLParseError, YAMLWarning } from 'yaml';
import { readfile } from './file-reader';

export const parseYAML = async (filepath: string): Promise<any> => {
  const content: string = await readfile(filepath);
  try {
    const parsed: any = parse(content);
    return parsed;
  } catch (error) {
    if (error instanceof YAMLParseError || error instanceof YAMLWarning) {
      console.error(error);
    }
    return `>> ${filepath} is not a valid yaml file`;
  }
};
