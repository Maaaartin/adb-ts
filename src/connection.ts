import { Socket, SocketConstructorOpts } from 'net';
import Parser from './parser';
export default class Connection extends Socket {
    public readonly parser: Parser;
    constructor(options?: SocketConstructorOpts) {
        super(options);
        this.setKeepAlive(true);
        this.setNoDelay(true);
        this.parser = new Parser(this);
    }

    get readBytes() {
        return this.parser.readBytes;
    }

    get end_() {
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
