import { Type } from "./types";
import { Condition } from "./types";

export interface StateFile<DataUnit> {
    len(): number;
    setLimit(limit: number): void;
    addMetaAttr(attr: string, value: string): boolean;
    rmvMetaAttr(attr: string): boolean;
    extendUnitType(extension: Type): void;
    
    get(index: number): DataUnit;
    getWhere(cond: Condition<DataUnit>): DataUnit;
    getList(from: number, to: number): Array<DataUnit>;
    getListWhere(cond: Condition<DataUnit>): Array<DataUnit>;
    getIndexOf(cond: Condition<DataUnit>): number[];

    add(obj: DataUnit): void;
    update(index: number, newdata: DataUnit): boolean;
    updateWhere(cond: Condition<DataUnit>, newdata: DataUnit): boolean[];
    remove(index: number): boolean;
    removeWhere(cond: Condition<DataUnit>): boolean[];

    loadAll(): void;
    loadOne(): boolean;
    unloadOne(): boolean;

    seal(newCrackData?: Array<DataUnit>): void;
    split(): void;
    save(): void;
}