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
exports.SaveStrategy = void 0;
var SaveStrategy = /** @class */ (function () {
    function SaveStrategy(sfc) {
        this.sfc = sfc;
    }
    SaveStrategy.prototype.seal = function (newCrackData) {
        var dir = this.sfc.dirpath;
        var substate = this.sfc.meta.substate;
        var num = this.sfc.cracks_paths.length + 1;
        var newpath = "".concat(dir, "/").concat(substate, "/sf.").concat(num, ".").concat(substate, ".json");
        var file = this.sfc.fileManager.createFile(newpath, "");
        this.sfc.fileManager.addFile(newpath, file);
        this.sfc.cracks_paths.unshift(newpath);
        this.sfc.cracks_data.unshift(newCrackData || []);
        this.save();
    };
    SaveStrategy.prototype.split = function () {
        var tmp = [];
        var curcrack = this.sfc.cracks_data[0];
        var tmp_len = Math.floor(curcrack.length / 2);
        for (var i = tmp_len; i < curcrack.length; i++) {
            tmp.push(JSON.parse(JSON.stringify(curcrack[i])));
            delete curcrack[i];
        }
        curcrack.length -= tmp_len;
        this.seal(tmp);
    };
    SaveStrategy.prototype.save = function () {
        for (var i = 0; i < this.sfc.cracks_data.length; i++)
            this.saveCrack(i);
    };
    SaveStrategy.prototype.saveCrack = function (index) {
        var json_obj = {
            meta: __assign(__assign({}, this.sfc.meta), { substate: this.sfc.meta.substate, crack: this.sfc.cracks_paths.length - index, sealed: index > 0 }),
            data: __spreadArray([], this.sfc.cracks_data[index], true),
            unittype: this.sfc.unittype
        };
        var file = this.sfc.fileManager.getFile(this.sfc.cracks_paths[index]);
        file.setContent(JSON.stringify(json_obj));
        this.sfc.fileManager.writeFile(file);
    };
    return SaveStrategy;
}());
exports.SaveStrategy = SaveStrategy;
