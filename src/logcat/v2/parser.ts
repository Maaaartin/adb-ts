import { LogcatEntry, LogcatEntryV2 } from '../entry';
import { Parser as ParserParent } from '../parser';
import { charToPriority } from '../priority';

export default class Parser extends ParserParent {
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

    public *parse(chunk: Buffer): IterableIterator<LogcatEntryV2> {
        this.buffer = Buffer.concat([this.buffer, chunk]);
        const readUntil = this.buffer.lastIndexOf(Parser.NEW_LINE_BYTE);
        while (this.cursor < readUntil) {
            if (this.buffer[this.cursor] === Parser.DASH_BYTE) {
                const newLineIndex = this.indexOf(Parser.NEW_LINE_BYTE);
                this.cursor = newLineIndex + 1;
                continue;
            }

            const dateBuff = this.buffer.subarray(
                this.cursor,
                this.cursor + Parser.DATE_LEN
            );

            const date = new Date(dateBuff.toString());
            this.cursor += Parser.DATE_LEN;
            const pidBuff = this.buffer.subarray(
                this.cursor,
                this.cursor + Parser.ID_LEN
            );
            const pid = parseInt(pidBuff.toString(), 10);
            this.cursor += Parser.ID_LEN;
            const tidBuff = this.buffer.subarray(
                this.cursor,
                this.cursor + Parser.ID_LEN
            );
            const tid = parseInt(tidBuff.toString(), 10);
            this.cursor += Parser.ID_LEN;
            this.cursor++;
            const priorityBuff = this.buffer.subarray(
                this.cursor,
                this.cursor + 1
            );
            const priority = charToPriority(priorityBuff.toString());

            this.cursor += 2;
            const colonAtIndex = this.indexOf(Parser.COLON_BYTE);
            const tagBuff = this.buffer.subarray(this.cursor, colonAtIndex);
            this.cursor = colonAtIndex;
            this.cursor += 2;
            const tag = tagBuff.toString();
            const newLineAtIndex = this.indexOf(Parser.NEW_LINE_BYTE);
            const messageBuff = this.buffer.subarray(
                this.cursor,
                newLineAtIndex
            );

            const message = messageBuff.toString();
            this.cursor = newLineAtIndex;
            this.cursor += 1;

            yield { date, pid, tid, priority, tag, message };
        }
        this.buffer = this.buffer.subarray(readUntil + 1);
        this.cursor = 0;
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
