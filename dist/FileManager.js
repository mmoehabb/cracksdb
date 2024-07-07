"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManager = void 0;
var node_fs_1 = require("node:fs");
var File = /** @class */ (function () {
    function File(path, content) {
        this.fpath = path;
        this.fcontent = content;
    }
    Object.defineProperty(File.prototype, "path", {
        get: function () {
            return this.fpath;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(File.prototype, "content", {
        get: function () {
            return this.fcontent;
        },
        enumerable: false,
        configurable: true
    });
    File.prototype.setContent = function (text) {
        this.fcontent = text;
    };
    File.prototype.appendContent = function (text) {
        this.fcontent = this.fcontent + text;
        if (this.onAppend)
            this.onAppend(text);
    };
    File.prototype.setOnAppend = function (func) {
        this.onAppend = func;
    };
    return File;
}());
var FileManager = /** @class */ (function () {
    function FileManager(files) {
        this.files = files;
    }
    FileManager.prototype.createFile = function (path, content) {
        return new File(path, content || "");
    };
    // It's assumed that no two names (files) share the same path
    FileManager.prototype.addFile = function (name, file) {
        if (name in Object.keys(this.files))
            throw Error("Cannot add two files with the same name.");
        if (node_fs_1.default.existsSync(file.path)) {
            console.warn("Already found file " + file.path + " in storage.");
            this.files[name] = file;
            file.setContent(this.read(file.path));
        }
        else {
            this.files[name] = file;
            this.write(file.path, file.content);
        }
    };
    FileManager.prototype.getFile = function (name) {
        var found = this.files[name];
        if (found)
            return found;
        else
            throw Error("Couldn't find file: " + name);
    };
    FileManager.prototype.rmvFile = function (name) {
        var _this = this;
        var file = this.getFile(name);
        if (node_fs_1.default.existsSync(file.path))
            node_fs_1.default.rm(file.path, function () { return delete _this.files[name]; });
    };
    /*
        simulFile and unSimulFile are intended to be used by users
        in order to make, or make not, the actual file on disk changes
        simultaneously when the File object content changes.
    */
    FileManager.prototype.simulFile = function (file) {
        var _this = this;
        // ensure that the file on disk is up-to-date
        this.writeFile(file);
        file.setOnAppend(function (change) {
            _this.append(file.path, change);
        });
    };
    FileManager.prototype.unSimulFile = function (file) {
        file.setOnAppend(function () { });
    };
    FileManager.prototype.writeFile = function (file) {
        this.write(file.path, file.content);
    };
    FileManager.prototype.exploreDir = function (dirpath) {
        var arr = [];
        node_fs_1.default.readdirSync(dirpath).forEach(function (file) {
            arr.push(file);
        });
        return arr;
    };
    FileManager.prototype.createDir = function (dirpath) {
        if (!node_fs_1.default.existsSync(dirpath))
            node_fs_1.default.mkdirSync(dirpath);
    };
    FileManager.prototype.deleteDir = function (dirpath) {
        node_fs_1.default.rmdirSync(dirpath, { recursive: true });
    };
    FileManager.prototype.read = function (filepath) {
        try {
            var fileContent = node_fs_1.default.readFileSync(filepath, { encoding: 'utf8' });
            return fileContent;
        }
        catch (err) {
            throw Error(err);
        }
    };
    FileManager.prototype.write = function (filepath, content) {
        try {
            var data = new Uint8Array(Buffer.from(content));
            node_fs_1.default.writeFileSync(filepath, data);
        }
        catch (err) {
            throw Error(err);
        }
    };
    FileManager.prototype.append = function (filepath, content) {
        try {
            var data = new Uint8Array(Buffer.from(content));
            node_fs_1.default.appendFileSync(filepath, data);
        }
        catch (err) {
            throw Error(err);
        }
    };
    return FileManager;
}());
exports.FileManager = FileManager;
