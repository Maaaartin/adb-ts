import { Connection } from '../connection';
import { Reply } from '../util';
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

    protected async validateReply(reply: string | Buffer): Promise<void> {
        const replyStr = reply.toString();
        switch (replyStr) {
            case Reply.OKAY:
                return undefined;
            case Reply.FAIL:
                throw await this.parser.readError();
            default:
                throw this.parser.unexpected(
                    replyStr,
                    [Reply.OKAY, Reply.FAIL].join(' or ')
                );
        }
    }

    protected async readAndValidateReply(): Promise<void> {
        return this.validateReply(await this.parser.readAscii(4));
    }

    public endConnection(): void {
        this.connection.end();
    }

    protected async initAndValidateReply(args: string): Promise<void> {
        this.connection.write(encodeData(args));
        try {
            return this.readAndValidateReply();
        } finally {
            this.autoEnd && this.endConnection();
        }
    }
    protected async initExecute(args: string): Promise<string> {
        this.connection.write(encodeData(args));
        try {
            return this.parser.readAscii(4);
        } finally {
            this.autoEnd && this.endConnection();
        }
    }

    public abstract execute(): Promise<T>;
}
