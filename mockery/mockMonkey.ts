import { MonkeyCallback } from '../lib/util';
import Api from '../lib/monkey/api';
import { Reply } from '../lib/monkey/reply';

export default class MonkeyMock extends Api {
    private reply_: Reply;

    constructor(reply: Reply) {
        super();
        this.reply_ = reply;
    }
    public send<T>(command: string, cb?: MonkeyCallback<T> | undefined): this {
        if (this.reply_.isError()) {
            cb?.(
                new Error(this.reply_.value || 'Unknown error'),
                null,
                command
            );
        } else {
            cb?.(null, this.reply_.value as T, command);
        }
        return this;
    }
    public sendAndParse<T>(
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
