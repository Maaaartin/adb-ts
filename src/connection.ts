import { Socket, SocketConstructorOpts } from 'net';
import { promisify } from 'util';
import Parser from './parser';
export default class Connection extends Socket {
    public readonly parser: Parser;
    constructor(options?: SocketConstructorOpts) {
        super(options);
        this.setKeepAlive(true);
        this.setNoDelay(true);
        this.parser = new Parser(this);
    }

    public endAsync(): Promise<void> {
        return this.endParser().then(() =>
            promisify<void>((cb) => this.end(() => cb(null)))()
        );
    }

    get readBytes() {
        return this.parser.readBytes;
    }

    get endParser() {
        return this.parser.end;
    }

    get readAscii() {
        return this.parser.readAscii;
    }

    get readValue() {
        return this.parser.readValue;
    }

    get readError() {
        return this.parser.readError;
    }

    get unexpected() {
        return this.parser.unexpected;
    }

    get readByteFlow() {
        return this.parser.readByteFlow;
    }

    get searchLine() {
        return this.parser.searchLine;
    }

    get readAll() {
        return this.parser.readAll;
    }
}
