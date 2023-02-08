import Promise from 'bluebird';
import { Writable } from 'stream';
import Connection from './connection';
import { decodeLength, PrematureEOFError, UnexpectedDataError } from '.';

export default class Parser {
  private readonly stream: Connection;
  private ended: boolean;
  constructor(stream: Connection) {
    this.stream = stream;
    this.ended = false;
  }
  readBytes(howMany: number): Promise<Buffer> {
    let tryRead: () => void,
      errorListener: (err: Error) => void,
      endListener: () => void;
    return new Promise<Buffer>((resolve, reject) => {
      tryRead = () => {
        if (howMany) {
          let chunk;
          if ((chunk = this.stream.read(howMany))) {
            howMany -= chunk.length;
            if (howMany === 0) {
              return resolve(chunk);
            }
          }

          if (this.ended) {
            return reject(new PrematureEOFError(howMany));
          }
        } else {
          return resolve(Buffer.alloc(0));
        }
      };

      this.stream.on('readable', tryRead);
      errorListener = (err: Error) => {
        return reject(err);
      };
      this.stream.on('error', errorListener);
      endListener = () => {
        this.ended = true;
        return reject(new PrematureEOFError(howMany));
      };
      this.stream.on('end', endListener);
      tryRead();
    }).finally(() => {
      this.stream.removeListener('readable', tryRead);
      this.stream.removeListener('error', errorListener);
      return this.stream.removeListener('end', endListener);
    });
  }

  end() {
    let tryRead: () => void,
      errorListener: (err: Error) => void,
      endListener: () => void;
    return new Promise((resolve, reject) => {
      tryRead = () => {
        while (this.stream.read()) {
          continue;
        }
      };
      this.stream.on('readable', () => {
        tryRead();
      });
      errorListener = (err) => {
        return reject(err);
      };
      this.stream.on('error', errorListener);
      endListener = () => {
        this.ended = true;
        return resolve();
      };
      this.stream.on('end', endListener);
      if (this.ended) {
        return resolve();
      }
      this.stream.read(0);
      this.stream.end();
    }).finally(() => {
      this.stream.removeListener('readable', tryRead);
      this.stream.removeListener('error', errorListener);
      return this.stream.removeListener('end', endListener);
    });
  }

  readAscii(howMany: number) {
    return this.readBytes(howMany).then((chunk) => {
      return chunk.toString('ascii');
    });
  }

  readValue() {
    return this.readAscii(4).then((value) => {
      const length = decodeLength(value);
      return this.readBytes(length);
    });
  }

  readError() {
    return this.readValue().then((value) => {
      return Promise.reject(new Error(value.toString()));
    });
  }

  unexpected(data: string, expected: string) {
    return Promise.reject(new UnexpectedDataError(data, expected));
  }

  readByteFlow(howMany: number, targetStream: Writable) {
    let tryRead: () => void,
      errorListener: (err: Error) => void,
      endListener: () => void;
    return new Promise((resolve, reject) => {
      tryRead = () => {
        let chunk: Buffer;
        if (howMany) {
          while ((chunk = this.stream.read(howMany) || this.stream.read())) {
            howMany -= chunk.length;
            targetStream.write(chunk);
            if (howMany === 0) {
              return resolve();
            }
          }
          if (this.ended) {
            return reject(new PrematureEOFError(howMany));
          }
        } else {
          return resolve();
        }
      };
      endListener = () => {
        this.ended = true;
        return reject(new PrematureEOFError(howMany));
      };
      errorListener = (err) => {
        return reject(err);
      };
      this.stream.on('readable', tryRead);
      this.stream.on('error', errorListener);
      this.stream.on('end', endListener);
      tryRead();
    }).finally(() => {
      this.stream.removeListener('readable', tryRead);
      this.stream.removeListener('error', errorListener);
      return this.stream.removeListener('end', endListener);
    });
  }

  private readUntil(code: number) {
    let skipped = Buffer.alloc(0);
    const read = (): Promise<Buffer> => {
      return this.readBytes(1).then((chunk) => {
        if (chunk[0] === code) {
          return skipped;
        } else {
          skipped = Buffer.concat([skipped, chunk]);
          return read();
        }
      });
    };
    return read();
  }

  private readline() {
    return this.readUntil(0x0a).then((line) => {
      if (line[line.length - 1] === 0x0d) {
        return line.slice(0, -1);
      } else {
        return line;
      }
    });
  }

  searchLine(regExp: RegExp): Promise<string[]> {
    return this.readline().then((line) => {
      let match;
      if ((match = regExp.exec(line.toString()))) {
        return match;
      } else {
        return this.searchLine(regExp);
      }
    });
  }

  readAll() {
    let tryRead: () => void,
      errorListener: (err: Error) => void,
      endListener: () => void;
    let all = Buffer.alloc(0);
    return new Promise<Buffer>((resolve, reject) => {
      tryRead = () => {
        let chunk;
        while ((chunk = this.stream.read())) {
          all = Buffer.concat([all, chunk]);
        }
        if (this.ended) {
          return resolve(all);
        }
      };
      this.stream.on('readable', tryRead);
      errorListener = (err) => {
        return reject(err);
      };
      this.stream.on('error', errorListener);
      endListener = () => {
        this.ended = true;
        return resolve(all);
      };
      this.stream.on('end', endListener);
    }).finally(() => {
      this.stream.removeListener('readable', tryRead);
      this.stream.removeListener('error', errorListener);
      return this.stream.removeListener('end', endListener);
    });
  }
}
