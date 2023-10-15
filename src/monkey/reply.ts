export abstract class Reply {
    public abstract value: string | null;
    public abstract isError(): this is ErrReply;
}

export class OkReply extends Reply {
    public value: string | null;
    constructor(value: string | null) {
        super();
        this.value = value;
    }

    public isError(): this is ErrReply {
        return false;
    }
}

export class ErrReply extends Reply {
    public value: string | null;
    constructor(value: string | null) {
        super();
        this.value = value;
    }

    public isError(): this is ErrReply {
        return true;
    }

    public toError(): Error {
        return new Error(this.value || 'Unknown error');
    }
}
