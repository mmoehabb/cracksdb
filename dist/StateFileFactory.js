"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateFileFactory = void 0;
var StateFileContainer_1 = require("./StateFileContainer");
var StateFileFactory = /** @class */ (function () {
    function StateFileFactory(fileManager) {
        this.fileManager = fileManager;
    }
    StateFileFactory.prototype.create = function (dirpath, substate_name) {
        var stateFileContainer = new StateFileContainer_1.StateFileContainer(this.fileManager, dirpath, substate_name);
        return {
            len: stateFileContainer.len.bind(stateFileContainer),
            setLimit: stateFileContainer.setLimit.bind(stateFileContainer),
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
    };
    return StateFileFactory;
}());
exports.StateFileFactory = StateFileFactory;
