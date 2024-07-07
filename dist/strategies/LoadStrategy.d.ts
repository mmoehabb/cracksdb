import { StateFileContainer } from "../StateFileContainer";
export declare class LoadStrategy<DataUnit> {
    private sfc;
    constructor(sfc: StateFileContainer<DataUnit>);
    loadAll(): void;
    loadOne(): boolean;
    unloadOne(): boolean;
    loadCrack(path: string): void;
    tmpLoad(todo: Function): any;
    tmpLoadAll(todo: Function): any;
}
