import { Type } from "./types";

export class Typer {
    private types = {
        STRING: "string",
        NUMBER: "number",
        BOOLEAN: "boolean",
        OBJECT: "object",
    }

    generateType(obj: object): Type {
        const gentype = {};
        for (let key in obj) {
            const type = this.typeOf(obj[key]);
            if (type === this.types.OBJECT)
                gentype[key] = this.generateType(obj[key])
            else if (type === "")
                continue;
            else 
                gentype[key] = type;
        }
        return gentype;
    }

    combineTypes(t1: Type, t2: Type) {
        return {
            ...t1,
            ...t2
        }
    }

    checkObj(obj: object, type: Type): boolean {
        const objtype = this.generateType(obj);
        return this.checkType(objtype, type);
    }

    checkType(t1: Type, t2: Type): boolean {
        for (let key in t2) {
            if (t1[key] === undefined)
                continue;

            if (this.typeOf(t2[key]) !== this.typeOf(t1[key]))
                return false;

            if (this.typeOf(t2[key]) === this.types.OBJECT)
                if (!this.checkType(t1[key] as Type, t2[key] as Type))
                    return false;

            if (t1[key] !== t2[key])
                return false;
        }

        return true;
    }

    typeOf(val: any) {
        const tmp = typeof val;

        if (tmp === "string")
            return this.types.STRING;
        else if (tmp === "number" || tmp === "bigint")
            return this.types.NUMBER;
        else if (tmp === "boolean")
            return this.types.BOOLEAN;
        else if (tmp === "object" && tmp !== null)
            return this.types.OBJECT;

        return "";
    }
}