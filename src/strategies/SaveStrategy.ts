import { StateFileContainer } from "../StateFileContainer";
import { SF } from "../types";

export class SaveStrategy<DataUnit> {
    private sfc: StateFileContainer<DataUnit>;

    constructor(sfc: StateFileContainer<DataUnit>) {
        this.sfc = sfc;
    }
    
    seal(newCrackData?: Array<DataUnit>) {
        const dir = this.sfc.dirpath;
        const substate = this.sfc.meta.substate;
        const num = this.sfc.cracks_paths.length + 1;
        const newpath = `${dir}/${substate}/sf.${num}.${substate}.json`;
        const file = this.sfc.fileManager.createFile(newpath, "");
        this.sfc.fileManager.addFile(newpath, file);
        this.sfc.cracks_paths.unshift(newpath);
        this.sfc.cracks_data.unshift(newCrackData || []);
        this.save();
    }

    split() {
        const tmp: Array<any> = [];
        const curcrack = this.sfc.cracks_data[0];
        const tmp_len = Math.floor(curcrack.length / 2);

        for (let i = tmp_len; i < curcrack.length; i++) {
            tmp.push(JSON.parse(JSON.stringify(curcrack[i])));
            delete curcrack[i];
        }
        curcrack.length -= tmp_len;

        this.seal(tmp);
    }

    save() {
        for (let i = 0; i < this.sfc.cracks_data.length; i++)
            this.saveCrack(i)
    }

    saveCrack(index: number) {
        const json_obj: SF = {
            meta: {
                ...this.sfc.meta,
                substate: this.sfc.meta.substate,
                crack: this.sfc.cracks_paths.length - index,
                sealed: index > 0
            },
            data: [...this.sfc.cracks_data[index]] as object[],
            unittype: this.sfc.unittype
        }
        const file = this.sfc.fileManager.getFile(this.sfc.cracks_paths[index]);
        file.setContent(JSON.stringify(json_obj));
        this.sfc.fileManager.writeFile(file)
    }
}