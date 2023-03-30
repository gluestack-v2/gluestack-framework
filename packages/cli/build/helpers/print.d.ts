declare const newline: () => void;
declare const info: (msg1: string, msg2?: string) => void;
declare const success: (msg1: string, msg2?: string) => void;
declare const error: (msg1: string, msg2?: string) => void;
declare const json: (msg1: string) => void;
declare const warning: (msg1: string, msg2?: string) => void;
export { newline, info, success, error, json, warning };
