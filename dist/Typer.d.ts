import { Type } from "./types";
export declare class Typer {
    private types;
    generateType(obj: object): Type;
    combineTypes(t1: Type, t2: Type): {
        [x: string]: "string" | "number" | "boolean" | Type;
    };
    checkObj(obj: object, type: Type): boolean;
    checkType(t1: Type, t2: Type): boolean;
    typeOf(val: any): string;
}
