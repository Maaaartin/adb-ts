import Connection from './connection';
import { encodeData } from '.';
import Parser from './parser';

export default abstract class Command implements Command {
    protected readonly connection_: Connection;
    protected readonly parser_: Parser;
    constructor(connection: Connection) {
        this.connection_ = connection;
        this.parser_ = new Parser(this.connection_);
    }

    public get connection() {
        return this.connection_;
    }

    public get parser() {
        return this.parser_;
    }

    public execute(...args: any[]): Promise<any> {
        this.connection_.write(encodeData(args.join(' ')));
        return this.parser_.readAscii(4).then((reply) => {
            return reply;
        });
    }

    escape(arg?: any): string {
        switch (typeof arg) {
            case 'undefined':
                return '';
            case 'string':
                return "'" + arg.replace(/'/g, "'\"'\"'") + "'";
            default:
                return `${arg}`;
        }
    }

    escapeCompat(arg?: any): string {
        switch (typeof arg) {
            case 'undefined':
                return '';
            case 'string':
                return '"' + arg.replace(/([$`\\!"])/g, '\\$1') + '"';
            default:
                return `${arg}`;
        }
    }
}
