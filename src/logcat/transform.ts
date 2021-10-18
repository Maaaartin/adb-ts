import { Stream } from 'stream';

export default class Transform extends Stream.Transform {
  private savedR: Buffer | null = null;

  _transform(chunk: Buffer, encoding: BufferEncoding, cb: VoidFunction) {
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
}
