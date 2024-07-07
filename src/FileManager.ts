import fs from "node:fs"

class File {
    private fpath: string;
    private fcontent: string;

    private onAppend: (textToAppend: string) => void;

    constructor(path: string, content: string) {
        this.fpath = path;
        this.fcontent = content;
    }

    get path() {
        return this.fpath;
    }

    get content() {
        return this.fcontent;
    }

    setContent(text: string) {
        this.fcontent = text;
    }

    appendContent(text: string) {
        this.fcontent = this.fcontent + text;
        if (this.onAppend)
            this.onAppend(text);
    }

    setOnAppend(func: typeof this.onAppend) {
        this.onAppend = func;
    }
}

type FilesObj = {[name: string]: File};

export class FileManager {
    private files: FilesObj;

    constructor(files: FilesObj) {
        this.files = files;
    }

    createFile(path: string, content?: string) {
        return new File(path, content || "");
    }
    
    // It's assumed that no two names (files) share the same path
    addFile(name: string, file: File) {
        if (name in Object.keys(this.files))
            throw Error("Cannot add two files with the same name.");
        
        if (fs.existsSync(file.path)) {
            console.warn("Already found file " + file.path + " in storage.");
            this.files[name] = file;
            file.setContent(this.read(file.path))
        }
        else {
            this.files[name] = file;
            this.write(file.path, file.content);
        }
    }

    getFile(name: keyof typeof this.files) {
        const found = this.files[name];
        if (found) 
            return found;
        else
            throw Error("Couldn't find file: " + name);
    }

    rmvFile(name: keyof typeof this.files) {
        const file = this.getFile(name);
        if (fs.existsSync(file.path))
            fs.rm(file.path, () => delete this.files[name]);
    }

    /*
        simulFile and unSimulFile are intended to be used by users
        in order to make, or make not, the actual file on disk changes 
        simultaneously when the File object content changes.
    */
    simulFile(file: File) {
        // ensure that the file on disk is up-to-date
        this.writeFile(file);
        file.setOnAppend((change) => {
            this.append(file.path, change);
        });
    }

    unSimulFile(file: File) {
        file.setOnAppend(() => {});
    }

    writeFile(file: File) {
        this.write(file.path, file.content);
    }

    exploreDir(dirpath: string): Array<string> {
        const arr: Array<string> = [];
        fs.readdirSync(dirpath).forEach(file => {
            arr.push(file);
        });
        return arr;
    }

    createDir(dirpath: string) {
        if (!fs.existsSync(dirpath))
            fs.mkdirSync(dirpath);
    }

    deleteDir(dirpath: string) {
        fs.rmdirSync(dirpath, { recursive: true })
    }

    private read(filepath: string): string {
        try {
            const fileContent = fs.readFileSync(filepath, { encoding: 'utf8' })
            return fileContent;
        }
        catch(err) {
            throw Error(err)
        }
    }
    
    private write(filepath: string, content: string) {
        try {
            const data = new Uint8Array(Buffer.from(content));
            fs.writeFileSync(filepath, data);
        }
        catch(err) {
            throw Error(err);
        }
    }

    private append(filepath: string, content: string) {
        try {
            const data = new Uint8Array(Buffer.from(content));
            fs.appendFileSync(filepath, data);
        }
        catch(err) {
            throw Error(err);
        }
    }
}