import IGluePluginStore from '../../../../types/store/interface/IGluePluginStore';
declare class GluePluginStoreFactory {
    stores: IGluePluginStore[];
    createPluginStoreInstance(path: string): number | IGluePluginStore | {
        [x: number]: boolean | undefined;
        length?: boolean | undefined;
        toString?: boolean | undefined;
        toLocaleString?: boolean | undefined;
        pop?: boolean | undefined;
        push?: boolean | undefined;
        concat?: boolean | undefined;
        join?: boolean | undefined;
        reverse?: boolean | undefined;
        shift?: boolean | undefined;
        slice?: boolean | undefined;
        sort?: boolean | undefined;
        splice?: boolean | undefined;
        unshift?: boolean | undefined;
        indexOf?: boolean | undefined;
        lastIndexOf?: boolean | undefined;
        every?: boolean | undefined;
        some?: boolean | undefined;
        forEach?: boolean | undefined;
        map?: boolean | undefined;
        filter?: boolean | undefined;
        reduce?: boolean | undefined;
        reduceRight?: boolean | undefined;
        find?: boolean | undefined;
        findIndex?: boolean | undefined;
        fill?: boolean | undefined;
        copyWithin?: boolean | undefined;
        entries?: boolean | undefined;
        keys?: boolean | undefined;
        values?: boolean | undefined;
        includes?: boolean | undefined;
        flatMap?: boolean | undefined;
        flat?: boolean | undefined;
        [Symbol.iterator]?: boolean | undefined;
        readonly [Symbol.unscopables]?: boolean | undefined;
        at?: boolean | undefined;
    } | {
        (...items: ConcatArray<IGluePluginStore>[]): IGluePluginStore[];
        (...items: (IGluePluginStore | ConcatArray<IGluePluginStore>)[]): IGluePluginStore[];
    } | ((searchElement: IGluePluginStore, fromIndex?: number | undefined) => number) | ((searchElement: IGluePluginStore, fromIndex?: number | undefined) => boolean) | ((index: number) => IGluePluginStore | undefined) | ((separator?: string | undefined) => string) | ((callbackfn: (value: IGluePluginStore, index: number, array: IGluePluginStore[]) => void, thisArg?: any) => void) | {
        (callbackfn: (previousValue: IGluePluginStore, currentValue: IGluePluginStore, currentIndex: number, array: IGluePluginStore[]) => IGluePluginStore): IGluePluginStore;
        (callbackfn: (previousValue: IGluePluginStore, currentValue: IGluePluginStore, currentIndex: number, array: IGluePluginStore[]) => IGluePluginStore, initialValue: IGluePluginStore): IGluePluginStore;
        <U>(callbackfn: (previousValue: U, currentValue: IGluePluginStore, currentIndex: number, array: IGluePluginStore[]) => U, initialValue: U): U;
    } | (<A, D extends number = 1>(this: A, depth?: D | undefined) => FlatArray<A, D>[]) | ((...items: IGluePluginStore[]) => number) | ((compareFn?: ((a: IGluePluginStore, b: IGluePluginStore) => number) | undefined) => IGluePluginStore[]) | ((value: IGluePluginStore, start?: number | undefined, end?: number | undefined) => IGluePluginStore[]) | ((target: number, start: number, end?: number | undefined) => IGluePluginStore[]);
    saveAllStores(): void;
}
export default GluePluginStoreFactory;
