import { StatsObject } from '../util';
import StreamHandler from '../streamHandler';

export class PushTransfer extends StreamHandler {
    private readonly stack: number[] = [];
    private readonly stats: StatsObject = {
        bytesTransferred: 0
    };

    public cancel(): boolean {
        return this.emit('cancel');
    }

    public push(byteCount: number): void {
        this.stack.push(byteCount);
    }

    public pop(): void {
        const byteCount = this.stack.pop();
        this.stats.bytesTransferred += byteCount || 0;
        this.emit('progress', this.stats);
    }

    public end(): void {
        this.emit('end');
    }

    public on(event: 'error', listener: (err: Error) => void): this;
    public on(event: 'end' | 'cancel', listener: () => void): this;
    public on(event: 'progress', listener: (stats: StatsObject) => void): this;
    public on(
        event: string,
        listener: ((err: Error) => void) | ((stats: StatsObject) => void)
    ): this {
        return super.on(event, listener);
    }
}
