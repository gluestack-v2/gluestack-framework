interface Writer {
    write(path: string, instanceName: string): Promise<void>;
}
declare const writer: Writer;
export default writer;
