import { Type } from "./types";
import { Condition } from "./types";

export interface StateFile<DataUnit> {
    len(): number;
    passkey(): string;
    setLimit(limit: number): void;
    getSimul(): boolean;
    setSimul(simul: boolean): void;

    addMetaAttr(attr: string, value: string): boolean;
    rmvMetaAttr(attr: string): boolean;
    getUnitType(): Type;
    extendUnitType(extension: Type): void;
    
    get(index: number): DataUnit;
    getWhere(cond: Condition<DataUnit>): DataUnit;
    getList(from: number, to: number): Array<DataUnit>;
    getListWhere(cond: Condition<DataUnit>): Array<DataUnit>;
    getIndexOf(cond: Condition<DataUnit>): number[];

    add(obj: DataUnit): void;
    update(index: number, builder: (prev: DataUnit) => DataUnit): void;
    updateWhere(cond: Condition<DataUnit>, builder: (prev: DataUnit) => DataUnit): boolean[];
    remove(index: number): void;
    removeWhere(cond: Condition<DataUnit>): boolean[];

    loadAll(): void;
    loadOne(): boolean;
    unloadOne(): boolean;

    seal(newCrackData?: Array<DataUnit>): void;
    split(): void;
    save(): void;
}
