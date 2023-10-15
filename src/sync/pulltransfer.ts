import { PassThrough } from 'stream';
import { StatsObject } from '../util';

export class PullTransfer extends PassThrough {
    private readonly stats: StatsObject = {
        bytesTransferred: 0
    };

    public cancel(): boolean {
        return this.emit('cancel');
    }

    public write(
        chunk: Buffer,
        encoding?: BufferEncoding,
        cb?: (error: Error | null | undefined) => void
    ): boolean;
    public write(
        chunk: Buffer,
        cb?: (error: Error | null | undefined) => void
    ): boolean;
    public write(
        chunk: Buffer,
        encoding?: BufferEncoding | ((error: Error | null | undefined) => void),
        cb?: (error: Error | null | undefined) => void
    ): boolean {
        this.stats.bytesTransferred += chunk.length;
        this.emit('progress', this.stats);
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = undefined;
        }
        return super.write(chunk, encoding, cb);
    }

    public on(event: 'close', listener: () => void): this;
    public on(event: 'data', listener: (chunk: unknown) => void): this;
    public on(event: 'end', listener: () => void): this;
    public on(event: 'error', listener: (err: Error) => void): this;
    public on(event: 'pause', listener: () => void): this;
    public on(event: 'readable', listener: () => void): this;
    public on(event: 'resume', listener: () => void): this;
    public on(event: 'progress', listener: (stats: StatsObject) => void): this;
    public on<T extends Array<unknown>>(
        event: string | symbol,
        listener: (...args: T) => void
    ): this;
    public on(
        event: string | symbol,
        listener:
            | ((chunk: unknown) => void)
            | ((err: Error) => void)
            | ((stats: StatsObject) => void)
    ): this {
        return super.on(event, listener);
    }
}
