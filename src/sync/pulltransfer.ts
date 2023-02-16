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
        encoding?: any,
        cb?: (error: Error | null | undefined) => void
    ): boolean {
        this.stats.bytesTransferred += chunk.length;
        this.emit('progress', this.stats);
        return super.write(chunk, encoding, cb);
    }
}
