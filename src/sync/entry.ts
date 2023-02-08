import Stats from './stats';

export default class SyncEntry extends Stats {
  public readonly name: string;
  constructor(name: string, mode: number, size: number, mtime: number) {
    super(mode, size, mtime);
    this.name = name;
  }

  toString() {
    return this.name;
  }
}
