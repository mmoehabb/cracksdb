import { FileManager } from "./FileManager";
import { StateFileFactory } from "./StateFileFactory";
import { StateFile } from "./StateFileInterface";

export {
    FileManager,
    StateFile,
    StateFileFactory
};

export class StateManager {
    private statefiles: object;
    private passkeys: object;

    private rootdir: string;
    private fileManager: FileManager;
    private factory: StateFileFactory;

    constructor(rootdir: string, fileManager: FileManager) {
        this.statefiles = {};
        this.passkeys = {};
        this.rootdir = rootdir;
        this.fileManager = fileManager;
        this.factory = new StateFileFactory(this.fileManager);
        fileManager.createDir(rootdir);

        // load existing substates if any
        const substates = fileManager.exploreDir(rootdir);
        for (let substate of substates)
            this.add(substate);
    }

    get substates() {
        return Object.keys(this.statefiles);
    }

    add<DataUnit extends {}>(substate: string, passkey?: string) {
        if (this.substates.includes(substate))
            throw Error(`StateManager: add: ${substate} statefile already exists!`);
        
        this.fileManager.createDir(`${this.rootdir}/${substate}`);
        const stateFile = this.factory.create<DataUnit>(this.rootdir, substate);
        this.statefiles[substate] = stateFile;
        if (passkey)
            this.passkeys[substate] = passkey;
        return stateFile;
    }

    get(substate: string): StateFile<object> {
        if (!this.substates.includes(substate))
            throw Error(`StateManager: get: ${substate} not found. Make sure you've added it.`);
        return this.statefiles[substate];
    }

    remove(substate: string) {
        if (!this.substates.includes(substate))
            throw Error(`StateManager: get: ${substate} not found. Make sure you've added it.`);
        delete this.statefiles[substate];
        delete this.passkeys[substate];
    }

    delete(substate: string, passkey: string) {
        if (!this.passkeys[substate]) 
            return;

        if (this.passkeys[substate] === passkey) {
            this.fileManager.deleteDir(`${this.rootdir}/${substate}`)
        }

        throw Error("StateManager: delete: invalid passkey.");
    }
}