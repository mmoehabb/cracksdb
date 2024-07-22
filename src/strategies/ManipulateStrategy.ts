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

        this.sfc.cracks_data[0].unshift(obj);

        if (this.sfc.getSimul())
            this.sfc.saver.saveCrack(0);
    }

    update(index: number, builder: (prev: DataUnit) => DataUnit) {
        this.sfc.retriever.getMut(index, (mutObj, crackIndex) => {
            // in case getMut returns {}
            if (!this.sfc.typer.checkObj(mutObj as object, this.sfc.unittype)) {
                throw Error("StateFile: update: index out of bound or data integrity error.");
            }
            const newdata = builder(JSON.parse(JSON.stringify(mutObj)));
            const newdata_type = this.sfc.typer.generateType(newdata as object);
            // the unittype should apply to the type of the newdata.
            // in other words, newdata cannot have fields that are 
            // undefined in the unittype
            if (!this.sfc.typer.checkType(this.sfc.unittype, newdata_type)) {
                throw Error("StateFile: update: newdata type is invalid.");
            }
            for (let key in newdata) {
                mutObj[key] = newdata[key];
            }
            if (this.sfc.getSimul()) {
              this.sfc.saver.saveCrack(crackIndex);
            }
        })
    }

    updateWhere(cond: Condition<DataUnit>, builder: (prev: DataUnit) => DataUnit): boolean[] {
        const successes: Array<boolean> = [];
        const indexex = this.sfc.retriever.getIndexOf(cond);

        const oldSimul = this.sfc.getSimul(); 
        this.sfc.setSimul(false);
        for (let i of indexex) {
          try {
            this.update(i, builder);
            successes.push(true);
          }
          catch(e) {
            successes.push(false);
          }
        }
        
        if (oldSimul == true) {
          this.sfc.setSimul(oldSimul)
          this.sfc.saver.save()
        }

        return successes;
    }

    remove(index: number) {
        if (index < 0) {
            throw Error("StateFile: remove: index out of bound.");
        }

        if (index >= this.sfc.len()) {
            if (this.sfc.cracks_data.length >= this.sfc.cracks_paths.length) {
                throw Error("StateFile: remove: index out of bound.");
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
            if (this.sfc.getSimul()) {
              this.sfc.saver.saveCrack(i)
            }
            break;
        }
    }

    removeWhere(cond: Condition<DataUnit>): boolean[] {
        const successes: Array<boolean> = [];
        const indexes = this.sfc.retriever.getIndexOf(cond);
        
        const oldSimul = this.sfc.getSimul(); 
        this.sfc.setSimul(false);
        for (let i of indexes) {
          try {
            this.remove(i)
            successes.push(true);
          }
          catch(e) {
            successes.push(false);
          }
        }
        if (oldSimul == true) {
          this.sfc.setSimul(oldSimul)
          this.sfc.saver.save()
        }

        return successes;
    }
}
