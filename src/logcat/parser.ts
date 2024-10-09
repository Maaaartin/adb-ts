import { EventEmitter } from 'stream';
import { LogcatEntry, LogcatEntryV2 } from './entry';
import { charToPriority, PriorityV2 } from './priority';

export interface IParser {
    parse(...data: unknown[]): void;
}

export class BinaryParser extends EventEmitter implements IParser {
    private buffer = Buffer.alloc(0);
    private readonly HEADER_SIZE_V1 = 20;
    private readonly HEADER_SIZE_MAX = 100;

    public parse(chunk: Buffer): void {
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
            entry.pid = this.buffer.readInt32LE(cursor);
            cursor += 4;
            entry.tid = this.buffer.readInt32LE(cursor);
            cursor += 4;
            const sec = this.buffer.readInt32LE(cursor);
            cursor += 4;
            const nsec = this.buffer.readInt32LE(cursor);
            entry.date = new Date(sec * 1000 + nsec / 1000000);
            cursor += 4;
            cursor = headerSize;
            const data = this.buffer.subarray(cursor, cursor + length);
            cursor += length;
            this.buffer = this.buffer.subarray(cursor);
            this.processEntry(entry, data);
        }
        if (this.buffer.length) {
            this.emit('wait');
        } else {
            this.emit('drain');
        }
    }

    private processEntry(entry: LogcatEntry, data: Buffer): void {
        entry.priority = data[0];
        let cursor = 1;
        const length = data.length;
        while (cursor < length) {
            if (data[cursor] === 0) {
                entry.tag = data.subarray(1, cursor).toString();
                entry.message = data
                    .subarray(cursor + 1, length - 1)
                    .toString();
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

    public on(event: 'entry', listener: (entry: LogcatEntry) => void): this;
    public on(event: 'error', listener: (err: Error) => void): this;
    public on(event: 'wait' | 'drain', listener: () => void): this;
    public on(
        event: string | symbol,
        listener: ((entry: LogcatEntry) => void) | ((err: Error) => void)
    ): this {
        return super.on(event, listener);
    }
}

export class TextParser implements IParser {
    private buffer = Buffer.alloc(0);
    private cursor = 0;
    private static readonly DATE_LEN = 29;
    private static readonly ID_LEN = 6;
    private static readonly DASH_BYTE = 45;
    private static readonly NEW_LINE_BYTE = 10;
    private static readonly COLON_BYTE = 58;

    private indexOf(value: string | number): number | never {
        const index = this.buffer.indexOf(value, this.cursor);
        if (index === -1) {
            throw new Error("Unprocessable entry data '" + this.buffer + "'");
        }
        return index;
    }

    private subarrayFromCursor(end?: number): Buffer {
        return this.buffer.subarray(this.cursor, end);
    }

    private parseDate(): Date {
        const dateBuff = this.subarrayFromCursor(
            this.cursor + TextParser.DATE_LEN
        );
        const date = new Date(dateBuff.toString());
        this.cursor += TextParser.DATE_LEN;
        return date;
    }

    private parsePid(): number {
        const pidBuff = this.subarrayFromCursor(
            this.cursor + TextParser.ID_LEN
        );
        const pid = parseInt(pidBuff.toString(), 10);
        this.cursor += TextParser.ID_LEN;
        return pid;
    }

    private parseTid(): number {
        const tidBuff = this.subarrayFromCursor(
            this.cursor + TextParser.ID_LEN
        );
        const tid = parseInt(tidBuff.toString(), 10);
        this.cursor += TextParser.ID_LEN + 1;
        return tid;
    }

    private parsePriority(): PriorityV2 {
        const priorityBuff = this.subarrayFromCursor(this.cursor + 1);
        const priority = charToPriority(priorityBuff.toString());
        this.cursor += 2;
        return priority;
    }

    private parseTag(): string {
        const colonAtIndex = this.indexOf(TextParser.COLON_BYTE);
        const tagBuff = this.subarrayFromCursor(colonAtIndex);
        this.cursor = colonAtIndex + 2;
        return tagBuff.toString();
    }

    private parseMessage(): string {
        const newLineAtIndex = this.indexOf(TextParser.NEW_LINE_BYTE);
        const messageBuff = this.subarrayFromCursor(newLineAtIndex);
        this.cursor = newLineAtIndex + 1;
        return messageBuff.toString();
    }

    public *parse(chunk: Buffer): IterableIterator<LogcatEntryV2> {
        this.buffer = Buffer.concat([this.buffer, chunk]);
        this.cursor = 0;
        const readUntil = this.buffer.lastIndexOf(TextParser.NEW_LINE_BYTE);
        while (this.cursor < readUntil) {
            if (this.buffer[this.cursor] === TextParser.DASH_BYTE) {
                const newLineIndex = this.indexOf(TextParser.NEW_LINE_BYTE);
                this.cursor = newLineIndex + 1;
                continue;
            }

            const date = this.parseDate();
            const pid = this.parsePid();
            const tid = this.parseTid();
            const priority = this.parsePriority();
            const tag = this.parseTag();
            const message = this.parseMessage();
            yield { date, pid, tid, priority, tag, message };
        }
        this.buffer = this.buffer.subarray(readUntil + 1);
    }
}
