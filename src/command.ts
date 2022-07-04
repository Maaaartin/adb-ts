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
                promisify<void>((cb): void =>
                    this.connection.end((): void => cb(null))
                )()
        );
    }

    public abstract execute(...args: any[]): Promise<T>;

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
