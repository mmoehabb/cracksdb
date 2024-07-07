import { StateFileContainer } from "../StateFileContainer";
import { SF } from "../types";

export class LoadStrategy<DataUnit> {
    private sfc: StateFileContainer<DataUnit>;

    constructor(sfc: StateFileContainer<DataUnit>) {
        this.sfc = sfc;
    }

    loadAll() {
        while (this.sfc.cracks_data.length < this.sfc.cracks_paths.length)
            this.loadCrack(this.sfc.cracks_paths[this.sfc.cracks_data.length]);
    }

    loadOne(): boolean {
        if (this.sfc.cracks_data.length >= this.sfc.cracks_paths.length)
            return false;

        this.loadCrack(this.sfc.cracks_paths[this.sfc.cracks_data.length]);
        return true;
    }

    unloadOne(): boolean {
        if (this.sfc.cracks_data.length > 1) {
            this.sfc.saver.saveCrack(this.sfc.cracks_data.length-1)
            this.sfc.cracks_data.pop();
            return true;
        }
        return false;
    }

    loadCrack(path: string) {
        const json = this.sfc.validateSF(path);
        if (!json) {
            throw Error(path + " file validation yields false!");
        }
        if ((json as SF).meta["limit"])
            this.sfc.meta["limit"] = (json as SF).meta["limit"];

        this.sfc.cracks_data.push((json as SF).data as DataUnit[]);
    }

    tmpLoad(todo: Function): any {
        this.loadOne();
        const res = todo();
        this.unloadOne();
        return res;
    }

    tmpLoadAll(todo: Function): any {
        this.loadAll();
        const res = todo();
        while (this.sfc.cracks_data.length > 1)
            this.unloadOne();
        return res;
    }
}