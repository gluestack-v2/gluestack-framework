import { IWriter } from '../types/app/interface/IWriter';
declare class Writer implements IWriter {
    write(path: string, instanceName: string): Promise<void>;
}
declare const _default: Writer;
export default _default;
