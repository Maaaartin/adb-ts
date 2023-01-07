import { Reply, OkReply, ErrReply } from './reply';
import { EventEmitter } from 'events';

export class Parser extends EventEmitter {
    private column = 0;
    private buffer = Buffer.from('');

    parse(chunk: Buffer): void {
        this.buffer = Buffer.concat([chunk]);

        while (this.column < this.buffer.length) {
            if (this.buffer[this.column] === 0x0a) {
                this.parseLine(this.buffer.subarray(0, this.column));
                this.buffer = this.buffer.subarray(this.column + 1);
                this.column = 0;
            }
            this.column += 1;
        }
    }

    private parseLine(line: Buffer): void {
        switch (line[0]) {
            case 0x4f:
                if (line.length === 2) {
                    this.emit('reply', new OkReply(null));
                    return;
                }
                this.emit('reply', new OkReply(line.toString('ascii', 3)));
                return;

            case 0x45:
                if (line.length === 5) {
                    this.emit('reply', new ErrReply(null));
                    return;
                }
                this.emit('reply', new ErrReply(line.toString('ascii', 6)));
                return;

            default:
                this.emit(
                    'error',
                    new SyntaxError("Unparsable line '" + line + "'")
                );
        }
    }

    on(event: 'reply', listener: (reply: Reply) => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }
}
