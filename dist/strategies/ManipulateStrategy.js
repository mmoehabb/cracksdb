"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManipulateStrategy = void 0;
var ManipulateStrategy = /** @class */ (function () {
    function ManipulateStrategy(sfc) {
        this.sfc = sfc;
    }
    ManipulateStrategy.prototype.add = function (obj) {
        if (!this.sfc.typer.checkObj(obj, this.sfc.unittype))
            throw Error("StateFile: add: DataUnit type is invalid.");
        if (this.sfc.cracks_data[0].length >= this.sfc.limit)
            this.sfc.saver.seal();
        this.sfc.cracks_data[0].push(obj);
        if (this.sfc.simul)
            this.sfc.saver.saveCrack(0);
    };
    ManipulateStrategy.prototype.update = function (index, newdata) {
        var _this = this;
        if (!this.sfc.typer.checkObj(newdata, this.sfc.unittype)) {
            console.error("StateFile: update: newdata type is invalid.");
            return false;
        }
        return this.sfc.loader.tmpLoadAll(function () {
            var mutObj = _this.sfc.retriever.getMut(index);
            if (!_this.sfc.typer.checkObj(mutObj, _this.sfc.unittype)) {
                console.error("StateFile: update: index out of bound.");
                return false;
            }
            for (var key in newdata) {
                mutObj[key] = newdata[key];
            }
            return true;
        });
    };
    ManipulateStrategy.prototype.updateWhere = function (cond, newdata) {
        if (!this.sfc.typer.checkObj(newdata, this.sfc.unittype))
            throw Error("StateFile: updateWhere: newdata type is invalid.");
        var successes = [];
        var indexex = this.sfc.retriever.getIndexOf(cond);
        for (var _i = 0, indexex_1 = indexex; _i < indexex_1.length; _i++) {
            var i = indexex_1[_i];
            successes.push(this.update(i, newdata));
        }
        return successes;
    };
    ManipulateStrategy.prototype.remove = function (index) {
        var _this = this;
        if (index < 0) {
            return false;
        }
        if (index >= this.sfc.len()) {
            if (this.sfc.cracks_data.length >= this.sfc.cracks_paths.length) {
                console.error("StateFile: get: index out of scope.");
                return false;
            }
            this.sfc.loader.tmpLoad(function () { return _this.remove(index); });
            return true;
        }
        var tmp = 0;
        for (var _i = 0, _a = this.sfc.cracks_data; _i < _a.length; _i++) {
            var cd = _a[_i];
            if (index >= (cd.length + tmp)) {
                tmp += cd.length;
                continue;
            }
            cd = __spreadArray(__spreadArray([], cd.slice(0, index - tmp), true), cd.slice(index - tmp + 1, cd.length), true);
            return true;
        }
        return false;
    };
    ManipulateStrategy.prototype.removeWhere = function (cond) {
        var successes = [];
        var indexes = this.sfc.retriever.getIndexOf(cond);
        for (var _i = 0, indexes_1 = indexes; _i < indexes_1.length; _i++) {
            var i = indexes_1[_i];
            successes.push(this.remove(i));
        }
        return successes;
    };
    return ManipulateStrategy;
}());
exports.ManipulateStrategy = ManipulateStrategy;
