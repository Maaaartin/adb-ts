export abstract class Reply {
    abstract value: string | null;
    abstract isError(): this is ErrReply;
}

export class OkReply extends Reply {
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
    value: string | null;
    constructor(value: string | null) {
        super();
        this.value = value;
    }

    isError(): this is ErrReply {
        return true;
    }

    toError(): Error {
        return new Error(this.value || 'Unknown error');
    }
}
