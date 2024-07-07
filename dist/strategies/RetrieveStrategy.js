"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrieveStrategy = void 0;
var RetrieveStrategy = /** @class */ (function () {
    function RetrieveStrategy(sfc) {
        this.sfc = sfc;
    }
    RetrieveStrategy.prototype.get = function (index) {
        return JSON.parse(JSON.stringify(this.getMut(index)));
    };
    RetrieveStrategy.prototype.getWhere = function (cond) {
        for (var i = 0; true; i++) {
            var obj = this.get(i);
            if (Object.keys(obj).length <= 0)
                return obj;
            if (cond(obj))
                return obj;
        }
    };
    RetrieveStrategy.prototype.getList = function (from, to) {
        var list = [];
        for (var i = from; i < to; i++)
            list.push(this.get(i));
        return list;
    };
    RetrieveStrategy.prototype.getListWhere = function (cond) {
        var list = [];
        for (var i = 0; true; i++) {
            var obj = this.get(i);
            if (Object.keys(obj).length <= 0)
                break;
            if (cond(obj))
                list.push(obj);
        }
        return list;
    };
    RetrieveStrategy.prototype.getIndexOf = function (cond) {
        var indexes = [];
        for (var i = 0; true; i++) {
            var obj = this.get(i);
            if (Object.keys(obj).length <= 0)
                break;
            if (cond(obj)) {
                indexes.push(i);
            }
        }
        return indexes;
    };
    RetrieveStrategy.prototype.getMut = function (index) {
        var _this = this;
        if (index < 0) {
            return {};
        }
        if (index >= this.sfc.len()) {
            if (this.sfc.cracks_data.length >= this.sfc.cracks_paths.length)
                return {};
            return this.sfc.loader.tmpLoad(function () { return _this.get(index); });
        }
        var tmp = 0;
        for (var _i = 0, _a = this.sfc.cracks_data; _i < _a.length; _i++) {
            var cd = _a[_i];
            if (index >= (cd.length + tmp)) {
                tmp += cd.length;
                continue;
            }
            return cd[index - tmp];
        }
    };
    return RetrieveStrategy;
}());
exports.RetrieveStrategy = RetrieveStrategy;
