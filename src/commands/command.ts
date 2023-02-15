import { Connection } from '../connection';
import { PrimitiveType, Reply } from '../util';
import { Parser } from '../parser';
import { encodeData } from '../util';

export default abstract class Command<T> {
    public readonly connection: Connection;
    public readonly parser: Parser;
    protected abstract autoEnd: boolean;
    constructor(connection: Connection) {
        this.connection = connection;
        this.parser = new Parser(this.connection);
    }

    // TODO kill usage of this?
    protected handleReply<T>(
        resolver: T | (() => T | Promise<T>)
    ): (reply: string | Buffer) => Promise<T> {
        return (reply) => {
            const resolverToPromise = (): Promise<T> => {
                if (typeof resolver === 'function') {
                    return Promise.resolve(
                        (resolver as () => T | Promise<T>)()
                    );
                }
                return Promise.resolve(resolver);
            };
            const replyStr = reply.toString();
            switch (replyStr) {
                case Reply.OKAY:
                    return resolverToPromise();
                case Reply.FAIL:
                    return this.parser.readError().then((e) => {
                        throw e;
                    });
                default:
                    throw this.parser.unexpected(
                        replyStr,
                        [Reply.OKAY, Reply.FAIL].join(' or ')
                    );
            }
        };
    }

    public endConnection(): void {
        this.connection.end();
    }

    // TODO should be param just string?
    protected async initAndValidateReply(
        ...args: PrimitiveType[]
    ): Promise<void> {
        this.connection.write(encodeData(args.join(' ')));
        try {
            return this.handleReply(undefined)(await this.parser.readAscii(4));
        } finally {
            this.autoEnd && this.endConnection();
        }
    }
    protected initExecute(...args: PrimitiveType[]): Promise<string> {
        this.connection.write(encodeData(args.join(' ')));
        return this.parser
            .readAscii(4)
            .finally(() => this.autoEnd && this.endConnection());
    }

    public abstract execute(): Promise<T>;
}
