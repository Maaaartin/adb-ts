export enum ReplyType {
    ERROR = 'ERROR',
    OK = 'OK'
}

export default class Reply {
    public type: ReplyType;
    public value: string;
    constructor(type: ReplyType, value: string) {
        this.type = type;
        this.value = value;
    }
    isError(): this is ReplyType.ERROR {
        return this.type === ReplyType.ERROR;
    }

    toError(): Error {
        if (!this.isError()) {
            throw new Error('toError() cannot be called for non-errors');
        }
        return new Error(this.value);
    }
}
