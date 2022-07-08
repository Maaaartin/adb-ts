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

    protected handleReply<T = void>(
        resolver: T | (() => T | Promise<T>)
    ): (reply: Reply) => Promise<T> {
        return (reply) => {
            const resolverToPromise = (): Promise<T> => {
                if (typeof resolver === 'function') {
                    return Promise.resolve(
                        (resolver as () => T | Promise<T>)()
                    );
                }
                return Promise.resolve(resolver);
            };
            switch (reply) {
                case Reply.OKAY:
                    return resolverToPromise();
                case Reply.FAIL:
                    return this.parser.readError().then((e) => {
                        throw e;
                    });
                default:
                    throw this.parser.unexpected(
                        reply,
                        [Reply.OKAY, Reply.FAIL].join(' or ')
                    );
            }
        };
    }

    protected end(): Promise<void> {
        return promisify<void>((cb) => this.connection._destroy(null, cb))();
    }

    protected initExecute(...args: PrimitiveType[]): Promise<Reply> {
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
