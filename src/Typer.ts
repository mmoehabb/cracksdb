import { argv0 } from "process";
import { Type } from "./types";
import { basename } from "path";

export class Typer {
    private types = {
        STRING: "string",
        NUMBER: "number",
        BOOLEAN: "boolean",
        OBJECT: "object",
        ARRAY: "array"
    }

    generateType(obj: object): Type {
        const gentype = {};
        for (let key in obj) {
            const type = this.typeOf(obj[key]);
            if (type === this.types.OBJECT)
                gentype[key] = this.generateType(obj[key])
            if (type === this.types.ARRAY)
                gentype[key] = {
                  length: "number",
                  ...this.generateType({...obj[key][0]})
                }
            else if (type === "")
                continue;
            else 
                gentype[key] = type;
        }
        return gentype;
    }

    combineTypes(t1: Type, t2: Type) {
      const combined = {...t1, ...t2}  
      for (let key in t2) {
        if (t1[key] === undefined) {
          continue
        }
        else if (this.typeOf(t1[key]) == this.types.OBJECT) {
          combined[key] = this.combineTypes(t1[key] as Type, t2[key] as Type)
        }
        else if (this.typeOf(t1[key]) == this.types.ARRAY) {
          combined[key] = this.combineTypes(t1[key] as Type, t2[key] as Type)
        }
        else if (t1[key] !== t2[key]) {
          throw Error("Typer Error: cannot combine two types with similar (string, number, or boolean) fields names but different types.")
        }
      }
      return combined
    }

    checkObj(obj: object, type: Type): boolean {
        const objtype = this.generateType(obj);
        return this.checkType(objtype, type);
    }

    checkType(t1: Type, t2: Type): boolean {
        for (let key in t2) {
            if (t1[key] === undefined)
                return false;

            const t2_key_type = this.typeOf(t2[key]) // just minor optimization
            if (t2_key_type !== this.typeOf(t1[key])) {
                return false;
            }
            if (t2_key_type === this.types.OBJECT) {
                if(!this.checkType(t1[key] as Type, t2[key] as Type)) {
                  return false;
                }
                continue
            }
            if (t2_key_type === this.types.ARRAY) {
              if(!this.checkType(t1[key] as Type, t2[key] as Type)) {
                return false;
              }
              continue
            }
            if (t1[key] !== t2[key]) {
                return false;
            }
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
        else if (tmp === "object" && val?.length !== undefined)
            return this.types.ARRAY;
        else if (tmp === "object" && tmp !== null)
            return this.types.OBJECT;
        else
            throw Error("Typer Error: unknown value type!")
    }

    defaultOf(type: Type, key: string) {
      const t = this.typeOf(type[key])
      if (t == this.types.STRING) {
        return ""
      }
      if (t == this.types.NUMBER) {
        return 0
      }
      if (t == this.types.BOOLEAN) {
        return false
      }
      if (t == this.types.OBJECT) {
        const obj = {}
        for (let k in type[key] as Type) {
          obj[k] = this.defaultOf(type[key] as Type, k)
        }
        return obj
      }
      if (t == this.types.ARRAY) {
        const elm = {}
        for (let k in type[key] as Type) {
          if (k == "length") continue
          elm[key] = this.defaultOf(type[key] as Type, k)
        }
        return [elm]
      }
    }
}
