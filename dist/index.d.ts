import { FileManager } from "./FileManager";
import { StateFile } from "./StateFileInterface";
export declare class StateManager {
    private statefiles;
    private passkeys;
    private rootdir;
    private fileManager;
    private factory;
    constructor(rootdir: string, fileManager: FileManager);
    get substates(): string[];
    add(substate: string, passkey?: string): StateFile<object>;
    get(substate: string): StateFile<object>;
    remove(substate: string): void;
    delete(substate: string, passkey: string): void;
}
