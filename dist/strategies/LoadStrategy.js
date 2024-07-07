"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadStrategy = void 0;
var LoadStrategy = /** @class */ (function () {
    function LoadStrategy(sfc) {
        this.sfc = sfc;
    }
    LoadStrategy.prototype.loadAll = function () {
        while (this.sfc.cracks_data.length < this.sfc.cracks_paths.length)
            this.loadCrack(this.sfc.cracks_paths[this.sfc.cracks_data.length]);
    };
    LoadStrategy.prototype.loadOne = function () {
        if (this.sfc.cracks_data.length >= this.sfc.cracks_paths.length)
            return false;
        this.loadCrack(this.sfc.cracks_paths[this.sfc.cracks_data.length]);
        return true;
    };
    LoadStrategy.prototype.unloadOne = function () {
        if (this.sfc.cracks_data.length > 1) {
            this.sfc.saver.saveCrack(this.sfc.cracks_data.length - 1);
            this.sfc.cracks_data.pop();
            return true;
        }
        return false;
    };
    LoadStrategy.prototype.loadCrack = function (path) {
        var json = this.sfc.validateSF(path);
        if (!json) {
            throw Error(path + " file validation yields false!");
        }
        if (json.meta["limit"])
            this.sfc.meta["limit"] = json.meta["limit"];
        this.sfc.cracks_data.push(json.data);
    };
    LoadStrategy.prototype.tmpLoad = function (todo) {
        this.loadOne();
        var res = todo();
        this.unloadOne();
        return res;
    };
    LoadStrategy.prototype.tmpLoadAll = function (todo) {
        this.loadAll();
        var res = todo();
        while (this.sfc.cracks_data.length > 1)
            this.unloadOne();
        return res;
    };
    return LoadStrategy;
}());
exports.LoadStrategy = LoadStrategy;
