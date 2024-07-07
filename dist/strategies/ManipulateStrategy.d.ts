import { StateFileContainer } from "../StateFileContainer";
import { Condition } from "../types";
export declare class ManipulateStrategy<DataUnit> {
    private sfc;
    constructor(sfc: StateFileContainer<DataUnit>);
    add(obj: DataUnit): void;
    update(index: number, newdata: DataUnit): boolean;
    updateWhere(cond: Condition<DataUnit>, newdata: DataUnit): boolean[];
    remove(index: number): boolean;
    removeWhere(cond: Condition<DataUnit>): boolean[];
}
