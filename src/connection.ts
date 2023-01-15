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
}
