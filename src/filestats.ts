import { Stats } from 'fs';

export interface IFileStats {
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

export default class FileStats extends Stats implements IFileStats {
  abits!: number;
  aflags!: string;
  allModeBits!: number;
  atimems!: number;
  bytes!: number;
  ctimems!: number;
  dTypeMajor!: number;
  dTypeMinor!: number;
  gname!: string;
  moutpoint!: string;
  mtimems!: number;
  name!: string;
  lname!: string;
  seccon!: string;
  type!: string;
  uname!: string;
  constructor(props: IFileStats) {
    super();
    Object.assign(this, props);
  }

  isSocket() {
    return /socket/.test(this.type);
  }

  isFIFO() {
    return /fifo/.test(this.type);
  }

  isSymbolicLink() {
    return /link/.test(this.type);
  }

  isCharacterDevice() {
    return /character/.test(this.type);
  }

  isBlockDevice() {
    return /block/.test(this.type);
  }

  isDirectory() {
    return /directory/.test(this.type);
  }

  isFile() {
    return /file/.test(this.type);
  }
}
