import { MonkeyCallback } from '../util/types';

export abstract class BaseCommand<T> {
    public readonly command: string;
    public readonly callback: MonkeyCallback<T>;
    constructor(command: string, callback: MonkeyCallback<T>) {
        this.callback = callback;
        this.command = command;
    }
    abstract isParsable(): this is ParsableCommand<T>;
}

export class Command extends BaseCommand<null> {
    isParsable(): this is ParsableCommand<null> {
        return false;
    }
}

export class ParsableCommand<T> extends BaseCommand<T> {
    isParsable(): this is ParsableCommand<T> {
        return true;
    }
    public readonly parser: (data: string | null) => T;
    constructor(
        command: string,
        callback: MonkeyCallback<T>,
        parser: (data: string | null) => T
    ) {
        super(command, callback);
        this.parser = parser;
    }
}
