import { MonkeyCallback } from '../util';

export abstract class BaseCommand<T> {
    public readonly command: string;
    public readonly callback: MonkeyCallback<T>;
    constructor(command: string, callback: MonkeyCallback<T>) {
        this.command = command;
        this.callback = callback;
    }
    public abstract isParsable(): this is ParsableCommand<T>;
}

export class Command extends BaseCommand<null> {
    public isParsable(): this is ParsableCommand<null> {
        return false;
    }
}

export class ParsableCommand<T> extends BaseCommand<T> {
    public isParsable(): this is ParsableCommand<T> {
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
