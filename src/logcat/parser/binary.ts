import LogcatEntry from '../entry';
import Parser from '../parser';

export default class Binary extends Parser {
    private buffer: Buffer;
    private readonly HEADER_SIZE_V1 = 20;
    private readonly HEADER_SIZE_MAX = 100;
    constructor() {
        super();
        this.buffer = Buffer.from('');
    }
    parse(chunk: Buffer): void {
        this.buffer = Buffer.concat([this.buffer, chunk]);
        while (this.buffer.length > 4) {
            let cursor = 0;
            const length = this.buffer.readUInt16LE(cursor);
            cursor += 2;
            let headerSize = this.buffer.readUInt16LE(cursor);
            if (
                headerSize < this.HEADER_SIZE_V1 ||
                headerSize > this.HEADER_SIZE_MAX
            ) {
                headerSize = this.HEADER_SIZE_V1;
            }
            cursor += 2;
            if (this.buffer.length < headerSize + length) {
                break;
            }
            const entry = new LogcatEntry();
            entry.setPid(this.buffer.readInt32LE(cursor));
            cursor += 4;
            entry.setTid(this.buffer.readInt32LE(cursor));
            cursor += 4;
            const sec = this.buffer.readInt32LE(cursor);
            cursor += 4;
            const nsec = this.buffer.readInt32LE(cursor);
            entry.setDate(new Date(sec * 1000 + nsec / 1000000));
            cursor += 4;
            cursor = headerSize;
            const data = this.buffer.slice(cursor, cursor + length);
            cursor += length;
            this.buffer = this.buffer.slice(cursor);
            this.processEntry(entry, data);
        }
        if (this.buffer.length) {
            this.emit('wait');
        } else {
            this.emit('drain');
        }
    }

    private processEntry(entry: LogcatEntry, data: Buffer): void {
        entry.setPriority(data[0]);
        let cursor = 1;
        const length = data.length;
        while (cursor < length) {
            if (data[cursor] === 0) {
                entry.setTag(data.slice(1, cursor).toString());
                entry.setMessage(data.slice(cursor + 1, length - 1).toString());
                this.emit('entry', entry);
                return;
            }
            cursor += 1;
        }
        this.emit(
            'error',
            new Error("Unprocessable entry data '" + data + "'")
        );
    }

    on(event: 'entry', listener: (entry: LogcatEntry) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'wait' | 'drain', listener: () => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }
}
