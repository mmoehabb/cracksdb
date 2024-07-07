declare class File {
    private fpath;
    private fcontent;
    private onAppend;
    constructor(path: string, content: string);
    get path(): string;
    get content(): string;
    setContent(text: string): void;
    appendContent(text: string): void;
    setOnAppend(func: typeof this.onAppend): void;
}
type FilesObj = {
    [name: string]: File;
};
export declare class FileManager {
    private files;
    constructor(files: FilesObj);
    createFile(path: string, content?: string): File;
    addFile(name: string, file: File): void;
    getFile(name: keyof typeof this.files): File;
    rmvFile(name: keyof typeof this.files): void;
    simulFile(file: File): void;
    unSimulFile(file: File): void;
    writeFile(file: File): void;
    exploreDir(dirpath: string): Array<string>;
    createDir(dirpath: string): void;
    deleteDir(dirpath: string): void;
    private read;
    private write;
    private append;
}
export {};
