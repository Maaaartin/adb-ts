import Connection from './connection';
import { encodeData, PrimitiveType, Reply } from '.';
import Parser from './parser';
import { promisify } from 'util';

export default abstract class Command<T = any> {
    public readonly connection: Connection;
    public readonly parser: Parser;
    protected keepAlive = false;
    constructor(connection: Connection) {
        this.connection = connection;
        this.parser = new Parser(this.connection);
    }

    protected handleReply<T>(reply: Reply, value: T): Promise<T> {
        switch (reply) {
            case Reply.OKAY:
                return Promise.resolve(value);
            case Reply.FAIL:
                return this.parser.readError().then((e) => {
                    throw e;
                });
            default:
                throw this.parser.unexpected(reply, 'OKAY or FAIL');
        }
    }
    protected end(): Promise<void> {
        return promisify<void>((cb) => this.connection._destroy(null, cb))();
    }

    protected execute_(...args: PrimitiveType[]): Promise<Reply> {
        this.connection.write(encodeData(args.join(' ')));
        return (this.parser.readAscii(4) as Promise<Reply>).finally(
            (): Promise<void> =>
                this.keepAlive ? Promise.resolve() : this.end()
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
