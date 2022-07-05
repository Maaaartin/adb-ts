import Connection from './connection';
import { encodeData, PrimitiveType, Reply } from '.';
import Parser from './parser';
import { promisify } from 'util';

export default abstract class Command<T = any> {
    public readonly connection: Connection;
    public readonly parser: Parser;
    constructor(connection: Connection) {
        this.connection = connection;
        this.parser = new Parser(this.connection);
    }

    protected execute_(...args: PrimitiveType[]): Promise<Reply> {
        this.connection.write(encodeData(args.join(' ')));
        return (this.parser.readAscii(4) as Promise<Reply>).finally(
            (): Promise<void> =>
                promisify<void>((cb) => this.connection._destroy(null, cb))()
        );
    }

    public abstract execute(...args: PrimitiveType[]): Promise<T>;

    escape(arg: PrimitiveType): string {
        switch (typeof arg) {
            case 'undefined':
                return '';
            case 'string':
                return "'" + arg.replace(/'/g, "'\"'\"'") + "'";
            default:
                return `${arg}`;
        }
    }

    escapeCompat(arg: PrimitiveType): string {
        switch (typeof arg) {
            case 'string':
                return '"' + arg.replace(/([$`\\!"])/g, '\\$1') + '"';
            default:
                return this.escape(arg);
        }
    }
}
