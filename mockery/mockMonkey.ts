import { MonkeyCallback } from '../lib';
import Api from '../lib/monkey/api';

type MonkeyReply = { status: 'OK' | 'ERROR'; reply: any };

export default class MonkeyMock extends Api {
    private reply_: MonkeyReply | null = null;
    constructor(reply: MonkeyReply | null) {
        super();
        this.reply_ = reply;
    }
    send(command: string, cb?: MonkeyCallback<any> | undefined): this {
        cb?.(null, this.reply_?.reply, command);
        return this;
    }
    sendAndParse<T>(
        commands: string | string[],
        cb?: MonkeyCallback<T> | undefined,
        parser?: ((data: string | null) => T) | undefined
    ): this {
        throw new Error('Method not implemented.');
    }
}
