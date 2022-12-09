import { MonkeyCallback } from '../lib';
import Api from '../lib/monkey/api';
import { Reply } from '../lib/monkey/reply';

export default class MonkeyMock extends Api {
    private reply_: Reply;
    constructor(reply: Reply) {
        super();
        this.reply_ = reply;
    }
    send(command: string, cb?: MonkeyCallback<any> | undefined): this {
        if (this.reply_.isError()) {
            cb?.(
                new Error(this.reply_.value || 'Unknown error'),
                null,
                command
            );
        } else {
            cb?.(null, this.reply_.value, command);
        }
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
