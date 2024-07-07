"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateFileContainer = void 0;
var Typer_1 = require("./Typer");
var LoadStrategy_1 = require("./strategies/LoadStrategy");
var ManipulateStrategy_1 = require("./strategies/ManipulateStrategy");
var RetrieveStrategy_1 = require("./strategies/RetrieveStrategy");
var SaveStrategy_1 = require("./strategies/SaveStrategy");
var StateFileContainer = /** @class */ (function () {
    function StateFileContainer(fileManager, dirpath, substate_name) {
        var _this = this;
        this.retriever = new RetrieveStrategy_1.RetrieveStrategy(this);
        this.manipulator = new ManipulateStrategy_1.ManipulateStrategy(this);
        this.loader = new LoadStrategy_1.LoadStrategy(this);
        this.saver = new SaveStrategy_1.SaveStrategy(this);
        this.typer = new Typer_1.Typer();
        this.cracks_data = [];
        this.cracks_paths = [];
        this.fileManager = fileManager;
        this.dirpath = dirpath;
        this.limit = 100;
        this.simul = true;
        // simplified regex for sf.[number].[substate_name].json
        var isSF = new RegExp("sf.[1-9][0-9]?[0-9]?.".concat(substate_name, ".json"));
        // explore sf files and store their names in an array
        var sfFiles = fileManager.exploreDir("".concat(dirpath, "/").concat(substate_name));
        sfFiles = sfFiles.filter(function (name) { return isSF.test(name); });
        // sort sf files according to cracks order
        sfFiles.sort(function (elem1, elem2) {
            var ord1 = _this.orderOf(elem1);
            var ord2 = _this.orderOf(elem2);
            if (ord1 < ord2)
                return -1;
            else if (ord1 > ord2)
                return 1;
            else
                return 0;
        });
        for (var _i = 0, sfFiles_1 = sfFiles; _i < sfFiles_1.length; _i++) {
            var sffile = sfFiles_1[_i];
            var path = "".concat(dirpath, "/").concat(substate_name, "/").concat(sffile);
            this.cracks_paths.unshift(path);
            fileManager.addFile(path, fileManager.createFile(path));
        }
        var lastCrack = this.cracks_paths[0];
        this.meta = {
            substate: substate_name,
            crack: lastCrack ? this.orderOf(lastCrack) : 1
        };
        if (lastCrack)
            this.loader.loadCrack(lastCrack);
        else {
            var path = "".concat(dirpath, "/").concat(substate_name, "/sf.1.").concat(substate_name, ".json");
            fileManager.addFile(path, fileManager.createFile(path));
            this.cracks_paths.unshift(path);
            this.unittype = {};
            this.cracks_data = [[]];
            this.saver.save();
        }
    }
    StateFileContainer.prototype.len = function () {
        var count = 0;
        for (var _i = 0, _a = this.cracks_data; _i < _a.length; _i++) {
            var cd = _a[_i];
            count += cd.length;
        }
        return count;
    };
    StateFileContainer.prototype.setLimit = function (limit) {
        this.limit = limit;
        this.saver.saveCrack(0);
    };
    StateFileContainer.prototype.addMetaAttr = function (attr, value) {
        if (["substate", "crack", "sealed"].includes(attr)) {
            return false;
        }
        this.meta[attr] = value;
        return true;
    };
    StateFileContainer.prototype.rmvMetaAttr = function (attr) {
        if (["substate", "crack", "sealed"].includes(attr)) {
            return false;
        }
        delete this.meta[attr];
        return true;
    };
    StateFileContainer.prototype.extendUnitType = function (extension) {
        var typer = new Typer_1.Typer();
        this.unittype = typer.combineTypes(this.unittype, extension);
        for (var _i = 0, _a = this.cracks_data; _i < _a.length; _i++) {
            var cd = _a[_i];
            for (var _b = 0, cd_1 = cd; _b < cd_1.length; _b++) {
                var unit = cd_1[_b];
                this.restruct(unit, this.unittype);
            }
        }
        this.saver.save();
    };
    StateFileContainer.prototype.orderOf = function (sfFileName) {
        return parseInt(sfFileName.split(".")[1]);
    };
    StateFileContainer.prototype.validateSF = function (path) {
        var jsonStr = this.fileManager.getFile(path).content;
        var json = JSON.parse(jsonStr);
        if (!json.meta || !json.data || !json.unittype)
            return false;
        if (json.meta.substate !== this.meta.substate)
            return false;
        if (json.meta.crack !== this.orderOf(path.split("/").slice(-1)[0]))
            return false;
        if (!this.unittype)
            this.unittype = __assign({}, json.unittype);
        else if (!this.typer.checkType(json.unittype, this.unittype))
            return false;
        return json;
    };
    StateFileContainer.prototype.restruct = function (obj, type) {
        for (var key in obj) {
            if (!type[key])
                delete obj[key];
        }
        for (var key in type) {
            if (!obj[key])
                obj[key] = null;
        }
    };
    return StateFileContainer;
}());
exports.StateFileContainer = StateFileContainer;
