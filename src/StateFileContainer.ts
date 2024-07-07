import { FileManager } from "./FileManager";
import { Typer } from "./Typer";
import { LoadStrategy } from "./strategies/LoadStrategy";
import { ManipulateStrategy } from "./strategies/ManipulateStrategy";
import { RetrieveStrategy } from "./strategies/RetrieveStrategy";
import { SaveStrategy } from "./strategies/SaveStrategy";
import { Meta, SF, Type } from "./types";

export class StateFileContainer<DataUnit> {
    meta: Meta;
    unittype: Type;
    cracks_paths: Array<string>;
    cracks_data: Array<Array<DataUnit>>;

    limit: number;
    simul: boolean;

    fileManager: FileManager;
    dirpath: string;

    typer: Typer;

    retriever: RetrieveStrategy<DataUnit>;
    manipulator: ManipulateStrategy<DataUnit>;
    loader: LoadStrategy<DataUnit>;
    saver: SaveStrategy<DataUnit>;

    constructor(fileManager: FileManager, dirpath: string, substate_name: string) {
        this.retriever = new RetrieveStrategy<DataUnit>(this);
        this.manipulator = new ManipulateStrategy<DataUnit>(this);
        this.loader = new LoadStrategy<DataUnit>(this);
        this.saver = new SaveStrategy<DataUnit>(this);
        this.typer = new Typer();

        this.cracks_data = [];
        this.cracks_paths = [];
        this.fileManager = fileManager;
        this.dirpath = dirpath
        this.limit = 100;
        this.simul = true;

        // simplified regex for sf.[number].[substate_name].json
        const isSF = new RegExp(`sf.[1-9][0-9]?[0-9]?.${substate_name}.json`)

        // explore sf files and store their names in an array
        let sfFiles = fileManager.exploreDir(`${dirpath}/${substate_name}`);
        sfFiles = sfFiles.filter(name => isSF.test(name));

        // sort sf files according to cracks order
        sfFiles.sort((elem1, elem2) => {
            const ord1 = this.orderOf(elem1);
            const ord2 = this.orderOf(elem2);

            if (ord1 < ord2) return -1;
            else if (ord1 > ord2) return 1;
            else return 0;
        })

        for (let sffile of sfFiles) {
            const path = `${dirpath}/${substate_name}/${sffile}`;
            this.cracks_paths.unshift(path);
            fileManager.addFile(path, fileManager.createFile(path));
        }

        const lastCrack = this.cracks_paths[0];
        this.meta = {
            substate: substate_name,
            crack: lastCrack ? this.orderOf(lastCrack) : 1
        }

        if (lastCrack)
            this.loader.loadCrack(lastCrack)
        else {
            const path = `${dirpath}/${substate_name}/sf.1.${substate_name}.json`;
            fileManager.addFile(path, fileManager.createFile(path));
            this.cracks_paths.unshift(path)
            this.unittype = {};
            this.cracks_data = [[]];
            this.saver.save();
        }
    }

    len(): number {
        let count = 0;
        for (let cd of this.cracks_data)
            count += cd.length;
        return count;
    }

    setLimit(limit: number) {
        this.limit = limit;
        this.saver.saveCrack(0);
    }

    addMetaAttr(attr: string, value: string): boolean {
        if (["substate", "crack", "sealed"].includes(attr)) {
            return false;
        }
        this.meta[attr] = value;
        return true;
    }

    rmvMetaAttr(attr: string): boolean {
        if (["substate", "crack", "sealed"].includes(attr)) {
            return false;
        }
        delete this.meta[attr];
        return true;
    }

    extendUnitType(extension: Type) {
        const typer = new Typer();
        this.unittype = typer.combineTypes(this.unittype, extension);
        for (let cd of this.cracks_data) {
            for (let unit of cd)
                this.restruct(unit, this.unittype);
        }
        this.saver.save();
    }

    orderOf(sfFileName: string) {
        return parseInt(sfFileName.split(".")[1]);
    }

    validateSF(path: string): SF | boolean {
        const jsonStr = this.fileManager.getFile(path).content;
        const json: SF = JSON.parse(jsonStr);

        if (!json.meta || !json.data || !json.unittype) 
            return false;

        if (json.meta.substate !== this.meta.substate)
            return false;

        if (json.meta.crack !== this.orderOf(path.split("/").slice(-1)[0]))
            return false;

        if (!this.unittype)
            this.unittype = {...json.unittype};
        else if (!this.typer.checkType(json.unittype, this.unittype)) 
            return false;

        return json;
    }

    restruct(obj: DataUnit, type: Type) {
        for (let key in obj) {
            if (!type[key])
                delete obj[key];
        }
        for (let key in type) {
            if (!obj[key])
                obj[key] = null;
        }
    }
}