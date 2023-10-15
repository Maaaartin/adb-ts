import { Stats } from 'fs';

export interface IFileStat {
    abits: number;
    aflags: string;
    atime: Date;
    atimeMs: number;
    blksize: number;
    blocks: number;
    bytes: number;
    ctime: Date;
    ctimeMs: number;
    dev: number;
    dTypeMajor: number;
    dTypeMinor: number;
    ino: number;
    gid: number;
    gname: string;
    mode: number;
    moutpoint: string;
    mtime: Date;
    mtimeMs: number;
    name: string;
    nlink: number;
    lname: string;
    seccon: string;
    size: number;
    type: string;
    uid: number;
    uname: string;
}

export class FileStat extends Stats implements IFileStat {
    public abits: number;
    public aflags: string;
    public atime: Date;
    public atimeMs: number;
    public blksize: number;
    public blocks: number;
    public bytes: number;
    public ctime: Date;
    public ctimeMs: number;
    public dev: number;
    public dTypeMajor: number;
    public dTypeMinor: number;
    public ino: number;
    public gid: number;
    public gname: string;
    public mode: number;
    public moutpoint: string;
    public mtime: Date;
    public mtimeMs: number;
    public name: string;
    public nlink: number;
    public lname: string;
    public seccon: string;
    public size: number;
    public type: string;
    public uid: number;
    public uname: string;
    constructor(props: IFileStat) {
        super();
        this.abits = props.abits;
        this.aflags = props.aflags;
        this.atime = props.atime;
        this.atimeMs = props.atimeMs;
        this.blksize = props.blksize;
        this.blocks = props.blocks;
        this.bytes = props.bytes;
        this.ctime = props.ctime;
        this.ctimeMs = props.ctimeMs;
        this.dev = props.dev;
        this.dTypeMajor = props.dTypeMajor;
        this.dTypeMinor = props.dTypeMinor;
        this.ino = props.ino;
        this.gid = props.gid;
        this.gname = props.gname;
        this.mode = props.mode;
        this.moutpoint = props.moutpoint;
        this.mtime = props.mtime;
        this.mtimeMs = props.mtimeMs;
        this.name = props.name;
        this.nlink = props.nlink;
        this.lname = props.lname;
        this.seccon = props.seccon;
        this.size = props.size;
        this.type = props.type;
        this.uid = props.uid;
        this.uname = props.uname;
    }

    public isSocket(): boolean {
        return /socket/.test(this.type);
    }

    public isFIFO(): boolean {
        return /fifo/.test(this.type);
    }

    public isSymbolicLink(): boolean {
        return /link/.test(this.type);
    }

    public isCharacterDevice(): boolean {
        return /character/.test(this.type);
    }

    public isBlockDevice(): boolean {
        return /block/.test(this.type);
    }

    public isDirectory(): boolean {
        return /directory/.test(this.type);
    }

    public isFile(): boolean {
        return /file/.test(this.type);
    }
}
