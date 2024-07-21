import { FileManager } from "./FileManager";
import { StateFileContainer } from "./StateFileContainer";
import { StateFile } from "./StateFileInterface";

export class StateFileFactory {
    private fileManager: FileManager;

    constructor(fileManager: FileManager) {
        this.fileManager = fileManager;
    }

    create<DataUnit extends object>(dirpath: string, substate_name: string, passkey?: string): StateFile<DataUnit> {
        const stateFileContainer = new StateFileContainer<DataUnit>(
            this.fileManager,
            dirpath,
            substate_name,
            passkey
        );

        return {
            len: stateFileContainer.len.bind(stateFileContainer),
            passkey: stateFileContainer.passkey.bind(stateFileContainer),
            setLimit: stateFileContainer.setLimit.bind(stateFileContainer),
            getSimul: stateFileContainer.getSimul.bind(stateFileContainer),
            setSimul: stateFileContainer.setSimul.bind(stateFileContainer),

            addMetaAttr: stateFileContainer.addMetaAttr.bind(stateFileContainer),
            rmvMetaAttr: stateFileContainer.rmvMetaAttr.bind(stateFileContainer),
            extendUnitType: stateFileContainer.extendUnitType.bind(stateFileContainer),
            
            get: stateFileContainer.retriever.get.bind(stateFileContainer.retriever),
            getWhere: stateFileContainer.retriever.getWhere.bind(stateFileContainer.retriever),
            getList: stateFileContainer.retriever.getList.bind(stateFileContainer.retriever),
            getListWhere: stateFileContainer.retriever.getListWhere.bind(stateFileContainer.retriever),
            getIndexOf: stateFileContainer.retriever.getIndexOf.bind(stateFileContainer.retriever),

            add: stateFileContainer.manipulator.add.bind(stateFileContainer.manipulator),
            update: stateFileContainer.manipulator.update.bind(stateFileContainer.manipulator),
            updateWhere: stateFileContainer.manipulator.updateWhere.bind(stateFileContainer.manipulator),
            remove: stateFileContainer.manipulator.remove.bind(stateFileContainer.manipulator),
            removeWhere: stateFileContainer.manipulator.removeWhere.bind(stateFileContainer.manipulator),

            loadAll: stateFileContainer.loader.loadAll.bind(stateFileContainer.loader),
            loadOne: stateFileContainer.loader.loadOne.bind(stateFileContainer.loader),
            unloadOne: stateFileContainer.loader.unloadOne.bind(stateFileContainer.loader),

            seal: stateFileContainer.saver.seal.bind(stateFileContainer.saver),
            split: stateFileContainer.saver.split.bind(stateFileContainer.saver),
            save: stateFileContainer.saver.save.bind(stateFileContainer.saver),
        };
    }
}
