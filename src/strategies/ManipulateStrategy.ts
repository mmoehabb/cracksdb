import { StateFileContainer } from "../StateFileContainer";
import { Condition } from "../types";

export class ManipulateStrategy<DataUnit> {
    private sfc: StateFileContainer<DataUnit>;

    constructor(sfc: StateFileContainer<DataUnit>) {
        this.sfc = sfc;
    }

    add(obj: DataUnit) {
        if (!this.sfc.typer.checkObj(obj as object, this.sfc.unittype)) 
            throw Error("StateFile: add: DataUnit type is invalid.");

        if (this.sfc.cracks_data[0].length >= this.sfc.limit)
            this.sfc.saver.seal();

        this.sfc.cracks_data[0].push(obj);

        if (this.sfc.simul)
            this.sfc.saver.saveCrack(0);
    }

    update(index: number, newdata: DataUnit): boolean {
        if (!this.sfc.typer.checkObj(newdata as object, this.sfc.unittype)) {
            console.error("StateFile: update: newdata type is invalid.");
            return false;
        }
        return this.sfc.retriever.getMut(index, (mutObj, crackIndex) => {
            // in case getMut returns {}
            if (!this.sfc.typer.checkObj(mutObj as object, this.sfc.unittype)) {
                console.error("StateFile: update: index out of bound or data integrity error.");
                console.error(mutObj);
                return false;
            }
            for (let key in newdata) {
                mutObj[key] = newdata[key];
            }
            if (this.sfc.simul) {
              this.sfc.saver.saveCrack(crackIndex);
            }
            return true;
        })
    }

    updateWhere(cond: Condition<DataUnit>, newdata: DataUnit): boolean[] {
        if (!this.sfc.typer.checkObj(newdata as object, this.sfc.unittype))
            throw Error("StateFile: updateWhere: newdata type is invalid.");

        const successes: Array<boolean> = [];
        const indexex = this.sfc.retriever.getIndexOf(cond);

        const oldSimul = this.sfc.simul; 
        this.sfc.setSimul(false);
        for (let i of indexex)
            successes.push(this.update(i, newdata));
        
        if (oldSimul == true) {
          this.sfc.setSimul(oldSimul)
          this.sfc.saver.save()
        }

        return successes;
    }

    remove(index: number): boolean {
        if (index < 0) {
            return false;
        }

        if (index >= this.sfc.len()) {
            if (this.sfc.cracks_data.length >= this.sfc.cracks_paths.length) {
                console.error("StateFile: get: index out of scope.");
                return false;
            }
            return this.sfc.loader.tmpLoad(() => this.remove(index));
        }

        let tmp = 0;
        let i = 0;
        for (let cd of this.sfc.cracks_data) {
            if (index >= (cd.length + tmp)) {
                tmp += cd.length;
                i += 1;
                continue;
            }
            this.sfc.cracks_data[i] = [...cd.slice(0, index-tmp), ...cd.slice(index-tmp+1, cd.length)]
            if (this.sfc.simul) {
              this.sfc.saver.saveCrack(i)
            }
            return true;
        }

        return false;
    }

    removeWhere(cond: Condition<DataUnit>): boolean[] {
        const successes: Array<boolean> = [];
        const indexes = this.sfc.retriever.getIndexOf(cond);
        
        const oldSimul = this.sfc.simul; 
        this.sfc.setSimul(false);
        for (let i of indexes) {
            successes.push(this.remove(i));
        }
        if (oldSimul == true) {
          this.sfc.setSimul(oldSimul)
          this.sfc.saver.save()
        }

        return successes;
    }
}
