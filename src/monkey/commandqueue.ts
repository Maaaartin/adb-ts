import Api from './api';
import { BaseCommand, Command, ParsableCommand } from './command';
import { Monkey } from './client';

export class CommandQueue extends Api {
    private client: Monkey;
    private commands: BaseCommand<unknown>[] = [];
    private replies: unknown[] = [];
    private errors: string[] = [];
    private sent = false;
    private callback?: (err: Error | null, data: unknown[]) => void;
    constructor(client: Monkey) {
        super();
        this.client = client;
    }

    private get queue(): BaseCommand<unknown>[] {
        return this.client.queue;
    }

    private set queue(queue: BaseCommand<unknown>[]) {
        this.client.queue = queue;
    }

    private collector(
        err: Error | null,
        value: unknown,
        command: string
    ): void {
        if (err) {
            this.errors.push(`${command}: ${err.message}`);
        }
        this.replies.push(value || null);
        return this.maybeFinish();
    }

    private maybeFinish(): void {
        if (this.client.queue.length === 0) {
            if (this.errors.length) {
                setImmediate(() => {
                    this.callback?.(new Error(this.errors.join(', ')), []);
                });
            } else {
                setImmediate(() => {
                    this.callback?.(null, this.replies);
                });
            }
        }
    }

    private forbidReuse(): void {
        if (this.sent) {
            throw new Error('Reuse not supported');
        }
    }

    private sendInternal(cmdConstruct: BaseCommand<unknown>): this {
        this.forbidReuse();
        this.commands.push(cmdConstruct);
        return this;
    }

    public sendAndParse<T>(
        command: string,
        _cb: never,
        parser: (data: string | null) => T | null
    ): this {
        return this.sendInternal(
            new ParsableCommand(
                command,
                this.collector.bind(this),
                parser as (data: string | null) => T
            ) as BaseCommand<unknown>
        );
    }

    public send(command: string): this {
        return this.sendInternal(
            new Command(
                command,
                this.collector.bind(this)
            ) as BaseCommand<unknown>
        );
    }

    private getCommands(): string {
        return this.commands
            .map((cmd) => cmd.command)
            .join('\n')
            .concat('\n');
    }

    private pushCommands(): void {
        this.queue = [...this.queue, ...this.commands];
    }

    public execute(cb: (err: Error | null, data: unknown[]) => void): void {
        this.forbidReuse();
        this.sent = true;
        this.callback = cb;
        if (this.commands.length === 0) {
            throw new Error('No commands to execute');
        }
        const commands = this.getCommands();
        this.pushCommands();
        this.commands = [];
        this.client.stream.write(commands);
    }
}
