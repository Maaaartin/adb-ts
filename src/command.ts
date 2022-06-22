import Connection from './connection';
import { encodeData } from '.';
import Parser from './parser';

export default abstract class Command implements Command {
    public readonly connection: Connection;
    public readonly parser: Parser;
    constructor(connection: Connection) {
        this.connection = connection;
        this.parser = new Parser(this.connection);
    }

    public execute(...args: any[]): Promise<any> {
        this.connection.write(encodeData(args.join(' ')));
        return this.parser.readAscii(4).then((reply) => {
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
