import { FileManager } from "./FileManager";
import { StateFile } from "./StateFileInterface";
export declare class StateFileFactory {
    private fileManager;
    constructor(fileManager: FileManager);
    create<DataUnit extends object>(dirpath: string, substate_name: string): StateFile<DataUnit>;
}
