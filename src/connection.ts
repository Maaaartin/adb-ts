import { Socket, SocketConstructorOpts } from 'net';
import Parser from './parser';
export default class Connection extends Socket {
    private readonly parser: Parser;
    constructor(options?: SocketConstructorOpts) {
        super(options);
        this.setKeepAlive(true);
        this.setNoDelay(true);
        this.parser = new Parser(this);
    }
    connect(options: any, connectionListener?: () => void): this;
    connect(port: number, host: string, connectionListener?: () => void): this;
    connect(port: number, connectionListener?: () => void): this;
    connect(path: string, connectionListener?: () => void): this;

    connect(param1: any, param2?: any, param3?: any): this {
        super.connect(param1, param2, param3);
        return this;
    }

    public getParser() {
        return this.parser;
    }
}