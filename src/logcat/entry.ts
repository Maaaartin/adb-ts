import { Priority } from "..";

export default class LogcatEntry {
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
        this.priority = null;
        this.tag = null;
        this.message = null;
    }

    setDate(date: Date) {
        this.date = date;
    }

    setPid(pid: number) {
        this.pid = pid;
    }

    setTid(tid: number) {
        this.tid = tid;
    }

    setPriority(priority: Priority) {
        this.priority = priority;
    };

    setTag(tag: string) {
        this.tag = tag;
    };

    setMessage(message: string) {
        this.message = message;
    };

    toBinary() {
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