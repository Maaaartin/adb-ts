import { Reply, OkReply, ErrReply } from './reply';
import { EventEmitter } from 'events';

export default class Parser extends EventEmitter {
    private column = 0;
    private buffer = Buffer.from('');

    parse(chunk: Buffer): void {
        this.buffer = Buffer.concat([this.buffer, chunk]);
        while (this.column < this.buffer.length) {
            if (this.buffer[this.column] === 0x0a) {
                this.parseLine(this.buffer.slice(0, this.column));
                this.buffer = this.buffer.slice(this.column + 1);
                this.column = 0;
            }
            this.column += 1;
        }
        if (this.buffer.length) {
            this.emit('wait');
        } else {
            this.emit('drain');
        }
    }

    private parseLine(line: Buffer): void {
        switch (line[0]) {
            case 0x4f:
                if (line.length === 2) {
                    this.emit('reply', new OkReply(null));
                } else {
                    this.emit('reply', new OkReply(line.toString('ascii', 3)));
                }
                break;
            case 0x45:
                if (line.length === 5) {
                    this.emit('reply', new ErrReply(null));
                } else {
                    this.emit('reply', new ErrReply(line.toString('ascii', 6)));
                }
                break;
            default:
                this.emit(
                    'error',
                    new SyntaxError("Unparseable line '" + line + "'")
                );
        }
    }

    on(event: 'wait' | 'drain', listener: () => void): this;
    on(event: 'reply', listener: (reply: Reply) => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }
}
