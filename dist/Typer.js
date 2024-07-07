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
exports.Typer = void 0;
var Typer = /** @class */ (function () {
    function Typer() {
        this.types = {
            STRING: "string",
            NUMBER: "number",
            BOOLEAN: "boolean",
            OBJECT: "object",
        };
    }
    Typer.prototype.generateType = function (obj) {
        var gentype = {};
        for (var key in obj) {
            var type = this.typeOf(obj[key]);
            if (type === this.types.OBJECT)
                gentype[key] = this.generateType(obj[key]);
            else if (type === "")
                continue;
            else
                gentype[key] = type;
        }
        return gentype;
    };
    Typer.prototype.combineTypes = function (t1, t2) {
        return __assign(__assign({}, t1), t2);
    };
    Typer.prototype.checkObj = function (obj, type) {
        var objtype = this.generateType(obj);
        return this.checkType(objtype, type);
    };
    Typer.prototype.checkType = function (t1, t2) {
        for (var key in t2) {
            if (t1[key] === undefined)
                continue;
            if (this.typeOf(t2[key]) !== this.typeOf(t1[key]))
                return false;
            if (this.typeOf(t2[key]) === this.types.OBJECT)
                if (!this.checkType(t1[key], t2[key]))
                    return false;
            if (t1[key] !== t2[key])
                return false;
        }
        return true;
    };
    Typer.prototype.typeOf = function (val) {
        var tmp = typeof val;
        if (tmp === "string")
            return this.types.STRING;
        else if (tmp === "number" || tmp === "bigint")
            return this.types.NUMBER;
        else if (tmp === "boolean")
            return this.types.BOOLEAN;
        else if (tmp === "object" && tmp !== null)
            return this.types.OBJECT;
        return "";
    };
    return Typer;
}());
exports.Typer = Typer;
