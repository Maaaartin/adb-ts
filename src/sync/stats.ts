import fs from 'fs';

export default class Stats extends fs.Stats {
    public readonly mode: number;
    public readonly size: number;
    public readonly mtime: Date;

    public static readonly S_IFMT = 0xf000;

    public static readonly S_IFSOCK = 0xc000;

    public static readonly S_IFLNK = 0xa000;

    public static readonly S_IFREG = 0x8000;

    public static readonly S_IFBLK = 0x6000;

    public static readonly S_IFDIR = 0x4000;

    public static readonly S_IFCHR = 0x2000;

    public static readonly S_IFIFO = 0x1000;

    public static readonly S_ISUID = 0x800;

    public static readonly S_ISGID = 0x400;

    public static readonly S_ISVTX = 0x200;

    public static readonly S_IRWXU = 0x1c0;

    public static readonly S_IRUSR = 0x100;

    public static readonly S_IWUSR = 0x80;

    public static readonly S_IXUSR = 0x40;

    public static readonly S_IRWXG = 0x38;

    public static readonly S_IRGRP = 0x20;
    constructor(mode: number, size: number, mtime: number) {
        super();
        this.mode = mode;
        this.size = size;
        this.mtime = new Date(mtime * 1000);
    }
}