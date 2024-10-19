import { EventEmitter } from 'stream';
import { LogcatEntry, LogcatEntryV2 } from './entry';
import { charToPriority } from './priority';

export interface IParser {
    parse(chunk: Buffer): void;
}

type RawEntry = Record<keyof LogcatEntryV2, Buffer>;

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

export abstract class TextParserBase implements IParser {
    private buffer = Buffer.alloc(0);
    private cursor = 0;
    protected static readonly DATE_LEN = 29;
    protected static readonly ID_LEN = 6;
    protected static readonly DASH_BYTE = 45;
    protected static readonly NEW_LINE_BYTE = 10;
    protected static readonly COLON_BYTE = 58;

    protected get Empty(): boolean {
        return this.buffer.length === 0;
    }
    protected abstract loop(): Iterable<LogcatEntryV2>;

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
            yield* this.loop();
        }
        this.buffer = this.buffer.subarray(readUntil + 1);
    }

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

    private parseDate(): Buffer {
        const dateBuff = this.subarrayFromCursor(
            this.cursor + TextParserBase.DATE_LEN
        );
        this.cursor += TextParserBase.DATE_LEN;
        return dateBuff;
    }

    private parsePid(): Buffer {
        const pidBuff = this.subarrayFromCursor(
            this.cursor + TextParserBase.ID_LEN
        );
        this.cursor += TextParserBase.ID_LEN;
        return pidBuff;
    }

    private parseTid(): Buffer {
        const tidBuff = this.subarrayFromCursor(
            this.cursor + TextParserBase.ID_LEN
        );
        this.cursor += TextParserBase.ID_LEN + 1;
        return tidBuff;
    }

    private parsePriority(): Buffer {
        const priorityBuff = this.subarrayFromCursor(this.cursor + 1);
        this.cursor += 2;
        return priorityBuff;
    }

    private parseTag(): Buffer {
        const colonAtIndex = this.indexOf(TextParserBase.COLON_BYTE);
        const tagBuff = this.subarrayFromCursor(colonAtIndex);
        this.cursor = colonAtIndex + 2;
        return tagBuff;
    }

    private parseMessage(): Buffer {
        const newLineAtIndex = this.indexOf(TextParserBase.NEW_LINE_BYTE);
        const messageBuff = this.subarrayFromCursor(newLineAtIndex);
        this.cursor = newLineAtIndex + 1;
        return messageBuff;
    }

    protected getRawEntry(): RawEntry {
        const date = this.parseDate();
        const pid = this.parsePid();
        const tid = this.parseTid();
        const priority = this.parsePriority();
        const tag = this.parseTag();
        const message = this.parseMessage();
        return { date, pid, tid, priority, tag, message };
    }

    protected *yieldEntry({
        date,
        pid,
        tid,
        priority,
        tag,
        message
    }: RawEntry): Iterable<LogcatEntryV2> {
        yield {
            date: new Date(date.toString()),
            pid: parseInt(pid.toString(), 10),
            tid: parseInt(tid.toString(), 10),
            priority: charToPriority(priority.toString()),
            tag: tag.toString(),
            message: message.toString()
        };
    }
}

export class TextParser extends TextParserBase {
    protected *loop(): IterableIterator<LogcatEntryV2> {
        yield* this.yieldEntry(this.getRawEntry());
    }
}

export class TextParserGrouped extends TextParserBase {
    private groupedMessages: Buffer = Buffer.alloc(0);
    private prevEntry: RawEntry | null = null;
    private *yieldGrouped(): Iterable<LogcatEntryV2> {
        if (!this.prevEntry) {
            return;
        }
        if (this.groupedMessages.length) {
            yield* this.yieldEntry({
                ...this.prevEntry,
                message: this.groupedMessages
            });
            this.groupedMessages = Buffer.alloc(0);
        } else {
            yield* this.yieldEntry(this.prevEntry);
        }
    }

    protected *loop(): Iterable<LogcatEntryV2> {
        const entry = this.getRawEntry();
        if (!this.prevEntry) {
            this.prevEntry = { ...entry };
            return;
        }
        const match = (
            Object.entries(this.prevEntry) as [keyof RawEntry, Buffer][]
        ).every(
            ([key, value]) =>
                key === 'message' || (key in entry && value.equals(entry[key]))
        );

        if (match) {
            this.groupedMessages = Buffer.concat([
                this.groupedMessages,
                this.prevEntry.message,
                Buffer.from([TextParser.NEW_LINE_BYTE]),
                entry.message
            ]);
        } else {
            yield* this.yieldGrouped();
        }
        this.prevEntry = { ...entry };
    }

    public *parse(chunk: Buffer): IterableIterator<LogcatEntryV2> {
        yield* super.parse(chunk);
        if (this.Empty) {
            yield* this.yieldGrouped();
            this.prevEntry = null;
        }
    }
}
