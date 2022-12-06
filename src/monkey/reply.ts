enum ReplyType {
    ERROR = 'ERROR',
    OK = 'OK'
}

export abstract class Reply {
    abstract type: ReplyType;
    abstract value: string | null;

    abstract isError(): this is ErrReply;
}

export class OkReply extends Reply {
    type = ReplyType.OK;
    value: string | null;
    constructor(value: string | null) {
        super();
        this.value = value;
    }

    isError(): this is ErrReply {
        return false;
    }
}

export class ErrReply extends Reply {
    type = ReplyType.ERROR;
    value: string | null;
    constructor(value: string | null) {
        super();
        this.value = value;
    }

    isError(): this is ErrReply {
        return true;
    }

    toError(): Error {
        return new Error(this.value);
    }
}
