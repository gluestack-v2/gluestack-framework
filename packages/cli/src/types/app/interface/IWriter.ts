export interface IWriter {
	write(path: string, instanceName: string): Promise<void>;
};
