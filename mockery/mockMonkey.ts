import { MonkeyCallback } from '../lib/util/types';
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
        command: string,
        cb?: MonkeyCallback<T> | undefined,
        parser?: (data: string | null) => T
    ): this {
        if (this.reply_.isError()) {
            cb?.(
                new Error(this.reply_.value || 'Unknown error'),
                null,
                command
            );
        } else {
            cb?.(null, parser?.(this.reply_.value) || null, command);
        }
        return this;
    }
}
