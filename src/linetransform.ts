import { Stream, TransformOptions } from 'stream';

interface LineTransformOptions extends TransformOptions {
  autoDetect: boolean;
}

export default class LineTransform extends Stream.Transform {
  private savedR: any;
  private autoDetect: boolean;
  private transformNeeded = true;
  private skipBytes = 0;
  constructor(options?: LineTransformOptions) {
    super(options);
    this.savedR = null;
    this.autoDetect = options?.autoDetect || false;
  }

  nullTransform(chunk: Buffer, encoding: BufferEncoding, cb: Function) {
    this.push(chunk);
    cb();
  }

  _transform(chunk: Buffer, encoding: BufferEncoding, cb: Function) {
    if (this.autoDetect) {
      if (chunk[0] === 0x0a) {
        this.transformNeeded = false;
        this.skipBytes = 1;
      } else {
        this.skipBytes = 2;
      }
      this.autoDetect = false;
    }
    if (this.skipBytes) {
      const skip = Math.min(chunk.length, this.skipBytes);
      chunk = chunk.slice(skip);
      this.skipBytes -= skip;
    }
    if (!chunk.length) {
      return cb();
    }
    if (!this.transformNeeded) {
      return this.nullTransform(chunk, encoding, cb);
    }
    let lo = 0;
    let hi = 0;
    if (this.savedR) {
      if (chunk[0] !== 0x0a) {
        this.push(this.savedR);
      }
      this.savedR = null;
    }
    const last = chunk.length - 1;
    while (hi <= last) {
      if (chunk[hi] === 0x0d) {
        if (hi === last) {
          this.savedR = chunk.slice(last);
          break;
        } else if (chunk[hi + 1] === 0x0a) {
          this.push(chunk.slice(lo, hi));
          lo = hi + 1;
        }
      }
      hi += 1;
    }
    if (hi !== lo) {
      this.push(chunk.slice(lo, hi));
    }
    cb();
  }

  _flush(cb: Function) {
    if (this.savedR) {
      this.push(this.savedR);
    }
    return cb();
  }
}
