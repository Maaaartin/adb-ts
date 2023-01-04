import { Priority } from './priority';

export class LogcatEntry {
    public date: Date;
    public pid: number;
    public tid: number;
    public priority: Priority;
    public tag: string;
    public message: string;
    constructor() {
        this.date = new Date();
        this.pid = -1;
        this.tid = -1;
        this.priority = Priority.SILENT;
        this.tag = '';
        this.message = '';
    }

    toBinary(): Buffer {
        let length = 20;
        length += 1;
        length += this.tag.length;
        length += 1;
        length += this.message.length;
        length += 1;
        const buffer = Buffer.alloc(length);
        let cursor = 0;
        buffer.writeUInt16LE(length - 20, cursor);
        cursor += 4;
        buffer.writeInt32LE(this.pid, cursor);
        cursor += 4;
        buffer.writeInt32LE(this.tid, cursor);
        cursor += 4;
        buffer.writeInt32LE(Math.floor(this.date.getTime() / 1000), cursor);
        cursor += 4;
        buffer.writeInt32LE((this.date.getTime() % 1000) * 1000000, cursor);
        cursor += 4;
        buffer[cursor] = this.priority;
        cursor += 1;
        buffer.write(this.tag, cursor, this.tag.length);
        cursor += this.tag.length;
        buffer[cursor] = 0x00;
        cursor += 1;
        buffer.write(this.message, cursor, this.message.length);
        cursor += this.message.length;
        buffer[cursor] = 0x00;
        return buffer;
    }
}
