"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateManager = void 0;
var StateFileFactory_1 = require("./StateFileFactory");
var StateManager = /** @class */ (function () {
    function StateManager(rootdir, fileManager) {
        this.statefiles = {};
        this.passkeys = {};
        this.rootdir = rootdir;
        this.fileManager = fileManager;
        this.factory = new StateFileFactory_1.StateFileFactory(this.fileManager);
        fileManager.createDir(rootdir);
        // load existing substates if any
        var substates = fileManager.exploreDir(rootdir);
        for (var _i = 0, substates_1 = substates; _i < substates_1.length; _i++) {
            var substate = substates_1[_i];
            this.add(substate);
        }
    }
    Object.defineProperty(StateManager.prototype, "substates", {
        get: function () {
            return Object.keys(this.statefiles);
        },
        enumerable: false,
        configurable: true
    });
    StateManager.prototype.add = function (substate, passkey) {
        if (this.substates.includes(substate))
            throw Error("StateManager: add: ".concat(substate, " statefile already exists!"));
        this.fileManager.createDir("".concat(this.rootdir, "/").concat(substate));
        var stateFile = this.factory.create(this.rootdir, substate);
        this.statefiles[substate] = stateFile;
        if (passkey)
            this.passkeys[substate] = passkey;
        return stateFile;
    };
    StateManager.prototype.get = function (substate) {
        if (!this.substates.includes(substate))
            throw Error("StateManager: get: ".concat(substate, " not found. Make sure you've added it."));
        return this.statefiles[substate];
    };
    StateManager.prototype.remove = function (substate) {
        if (!this.substates.includes(substate))
            throw Error("StateManager: get: ".concat(substate, " not found. Make sure you've added it."));
        delete this.statefiles[substate];
        delete this.passkeys[substate];
    };
    StateManager.prototype.delete = function (substate, passkey) {
        if (!this.passkeys[substate])
            return;
        if (this.passkeys[substate] === passkey) {
            this.fileManager.deleteDir("".concat(this.rootdir, "/").concat(substate));
        }
        throw Error("StateManager: delete: invalid passkey.");
    };
    return StateManager;
}());
exports.StateManager = StateManager;
