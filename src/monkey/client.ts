import { MonkeyCallback, NotConnectedError } from '..';
import { NetConnectOpts, Socket } from 'net';
import { Reply, ErrReply } from './reply';
import Api from './api';
import Command from './command';
import CommandQueue from './commandqueue';
import Parser from './parser';

export default class Monkey extends Api {
    public readonly queue: Command[] = [];
    private parser: Parser = new Parser();
    protected stream_?: Socket;
    private hadError = true;

    get stream(): Socket {
        if (!this.stream_) {
            throw new NotConnectedError();
        }
        return this.stream_;
    }

    send(commands: string[] | string, cb: MonkeyCallback): this {
        if (Array.isArray(commands)) {
            for (const command of commands) {
                this.queue.push(new Command(command, cb));
            }
            this.stream.write(commands.join('\n') + '\n');
        } else {
            this.queue.push(new Command(commands, cb));
            this.stream.write('' + commands + '\n');
        }

        setTimeout(() => {
            if (this.hadError) {
                this.consume(new ErrReply('Command failed'));
            }
        }, 100);

        return this;
    }

    protected hook(): void {
        this.stream.on('data', (data) => {
            this.hadError = false;
            return this.parser.parse(data);
        });
        this.stream.on('error', (err) => {
            return this.emit('error', err);
        });
        this.stream.on('end', () => {
            this.hadError = false;
            return this.emit('end');
        });
        this.stream.on('finish', () => {
            this.hadError = false;
            return this.emit('finish');
        });
        this.parser.on('reply', (reply) => {
            return this.consume(reply);
        });
        this.parser.on('error', (err) => {
            return this.emit('error', err);
        });
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
            this.stream_ = param;
        } else {
            this.stream_ = new Socket(param);
        }

        this.hook();
        return this;
    }

    end(): this {
        this.stream.end();
        return this;
    }

    commandQueue(): CommandQueue {
        return new CommandQueue(this);
    }
}
