import { MonkeyCallback, NotConnectedError } from '..';
import { NetConnectOpts, Socket } from 'net';
import Reply, { ReplyType } from './reply';
import Api from './api';
import Command from './command';
import CommandQueue from './commandqueue';
import Parser from './parser';

export default class Monkey extends Api {
    public readonly queue: Command[] = [];
    private parser: Parser = new Parser();
    protected stream?: Socket;
    private hadError = true;

    getStream(): Socket {
        if (!this.stream) {
            throw new NotConnectedError();
        }
        return this.stream;
    }

    send(commands: string[] | string, cb: MonkeyCallback): this {
        if (Array.isArray(commands)) {
            for (const command of commands) {
                this.queue.push(new Command(command, cb));
            }
            this.getStream().write(commands.join('\n') + '\n');
        } else {
            this.queue.push(new Command(commands, cb));
            this.getStream().write('' + commands + '\n');
        }

        setTimeout(() => {
            if (this.hadError) {
                this.consume(new Reply(ReplyType.ERROR, 'Command failed'));
            }
        }, 100);

        return this;
    }

    // TODO can be simplified?
    private hookResultListeners(): void {
        const events = ['data', 'end', 'finish'] as const;
        const handler = (): void => {
            this.hadError = false;
            events.forEach((ev) =>
                this.getStream().removeListener(ev, handler)
            );
        };

        events.forEach((ev) => this.getStream().on(ev, handler));
    }

    protected hook(): void {
        this.getStream().on('data', (data) => {
            return this.parser.parse(data);
        });
        this.getStream().on('error', (err) => {
            return this.emit('error', err);
        });
        this.getStream().on('end', () => {
            return this.emit('end');
        });
        this.getStream().on('finish', () => {
            return this.emit('finish');
        });
        this.parser.on('reply', (reply) => {
            return this.consume(reply);
        });
        this.parser.on('error', (err) => {
            return this.emit('error', err);
        });
        this.hookResultListeners();
    }

    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'end', listener: () => void): this;
    on(event: 'finish', listener: () => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    private consume(reply: Reply): void {
        const command = this.queue.shift();
        if (!command) {
            throw new Error(
                'Command queue depleted, but replies still coming in'
            );
        }

        if (reply.isError()) {
            return command.callback?.(reply.toError(), null, command.command);
        }

        command.callback?.(null, reply.value, command.command);
    }

    connect(options: NetConnectOpts): this;
    connect(stream: Socket): this;
    connect(param: Socket | NetConnectOpts): this {
        if (param instanceof Socket) {
            this.stream = param;
        } else {
            this.stream = new Socket(param);
        }

        this.hook();
        return this;
    }

    end(): this {
        this.getStream().end();
        return this;
    }

    commandQueue(): CommandQueue {
        return new CommandQueue(this);
    }
}
