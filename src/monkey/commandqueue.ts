import Api from './api';
import { BaseCommand, Command, ParsableCommand } from './command';
import Monkey from './client';
import { MonkeyCallback } from '../util//types';

export default class Multi extends Api {
    private client: Monkey;
    private commands: BaseCommand<any>[] = [];
    private replies: any[] = [];
    private errors: string[] = [];
    private sent = false;
    private callback?: (err: Error | null, data: any[]) => void;
    constructor(client: Monkey) {
        super();
        this.client = client;
    }

    private collector(
        err: Error | null,
        value: any | null,
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

    private sendInternal(cmdConstruct: () => BaseCommand<any>): this {
        this.forbidReuse();
        this.commands.push(cmdConstruct());
        return this;
    }

    sendAndParse(
        command: string,
        _cb: MonkeyCallback<any>,
        parser: (data: any) => any
    ): this {
        return this.sendInternal(() => {
            return new ParsableCommand(
                command,
                this.collector.bind(this),
                parser
            );
        });
    }

    send(command: string): this {
        return this.sendInternal(() => {
            return new Command(command, this.collector.bind(this));
        });
    }

    private getCommands(): string {
        return this.commands
            .map((cmd) => cmd.command)
            .join('\n')
            .concat('\n');
    }

    private pushCommands(): void {
        this.commands.forEach((cmd) => {
            this.client.queue.push(cmd);
        });
    }

    execute(cb: (err: Error | null, data: any[]) => void): void {
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
