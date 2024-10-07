import { LogcatEntry, LogcatEntryV2 } from '../entry';
import { Parser as ParserParent } from '../parser';
import { charToPriority } from '../priority';

export default class Parser extends ParserParent {
    private buffer = Buffer.alloc(0);
    private static readonly DATE_LEN = 29;
    private static readonly ID_LEN = 6;
    private static readonly DASH_BYTE = 45;
    private static readonly NEW_LINE_BYTE = 10;
    private static readonly COLON_BYTE = 58;

    public *parse(chunk: Buffer): IterableIterator<LogcatEntryV2> {
        let cursor = 0;
        this.buffer = Buffer.concat([this.buffer, chunk]);
        const readUntil = this.buffer.lastIndexOf(Parser.NEW_LINE_BYTE);
        while (cursor < readUntil) {
            if (this.buffer[cursor] === Parser.DASH_BYTE) {
                const newLineIndex = this.buffer.indexOf(
                    Parser.NEW_LINE_BYTE,
                    cursor
                );
                cursor = newLineIndex + 1;
                continue;
            }

            const dateBuff = this.buffer.subarray(
                cursor,
                cursor + Parser.DATE_LEN
            );

            const date = new Date(dateBuff.toString());
            cursor += Parser.DATE_LEN;
            const pidBuff = this.buffer.subarray(
                cursor,
                cursor + Parser.ID_LEN
            );
            const pid = parseInt(pidBuff.toString(), 10);
            cursor += Parser.ID_LEN;
            const tidBuff = this.buffer.subarray(
                cursor,
                cursor + Parser.ID_LEN
            );
            const tid = parseInt(tidBuff.toString(), 10);
            cursor += Parser.ID_LEN;
            cursor++;
            const priorityBuff = this.buffer.subarray(cursor, cursor + 1);
            const priority = charToPriority(priorityBuff.toString());

            cursor += 2;
            const colonAtIndex = this.buffer.indexOf(Parser.COLON_BYTE, cursor);
            const tagBuff = this.buffer.subarray(
                cursor,
                // TODO check -1 result
                colonAtIndex
            );
            cursor = colonAtIndex;
            cursor += 2;
            const tag = tagBuff.toString();
            const newLineAtIndex = this.buffer.indexOf(
                Parser.NEW_LINE_BYTE,
                cursor
            );
            const messageBuff = this.buffer.subarray(
                cursor,
                // TODO check -1 result
                newLineAtIndex
            );

            const message = messageBuff.toString();
            cursor = newLineAtIndex;
            cursor += 1;

            yield { date, pid, tid, priority, tag, message };
        }
        this.buffer = this.buffer.subarray(readUntil + 1);
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
