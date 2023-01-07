import { Socket, SocketConstructorOpts } from 'net';
import { Parser } from './parser';
export class Connection extends Socket {
    public readonly parser: Parser;
    constructor(options?: SocketConstructorOpts) {
        super(options);
        this.setKeepAlive(true);
        this.setNoDelay(true);
        this.parser = new Parser(this);
    }

    get readBytes(): typeof Parser.prototype.readBytes {
        return this.parser.readBytes;
    }

    get endParser(): typeof Parser.prototype.end {
        return this.parser.end;
    }

    get readAscii(): typeof Parser.prototype.readAscii {
        return this.parser.readAscii;
    }

    get readValue(): typeof Parser.prototype.readValue {
        return this.parser.readValue;
    }

    get readError(): typeof Parser.prototype.readError {
        return this.parser.readError;
    }

    get unexpected(): typeof Parser.prototype.unexpected {
        return this.parser.unexpected;
    }

    get readByteFlow(): typeof Parser.prototype.readByteFlow {
        return this.parser.readByteFlow;
    }

    get searchLine(): typeof Parser.prototype.searchLine {
        return this.parser.searchLine;
    }

    get readAll(): typeof Parser.prototype.readAll {
        return this.parser.readAll;
    }
}
