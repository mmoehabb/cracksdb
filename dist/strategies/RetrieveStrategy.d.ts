import { StateFileContainer } from "../StateFileContainer";
import { Condition } from "../types";
export declare class RetrieveStrategy<DataUnit extends {}> {
    private sfc;
    constructor(sfc: StateFileContainer<DataUnit>);
    get(index: number): DataUnit;
    getWhere(cond: Condition<DataUnit>): DataUnit;
    getList(from: number, to: number): Array<DataUnit>;
    getListWhere(cond: Condition<DataUnit>): Array<DataUnit>;
    getIndexOf(cond: Condition<DataUnit>): number[];
    getMut(index: number): any;
}
