import { MonkeyCallback } from '../util';
import { NotConnectedError } from '../util';
import { Socket } from 'net';
import { Reply, ErrReply } from './reply';
import Api from './api';
import { BaseCommand, Command, ParsableCommand } from './command';
import { CommandQueue } from './commandqueue';
import { Parser } from './parser';

export class Monkey extends Api {
    public queue: BaseCommand<any>[] = [];
    private parser: Parser = new Parser();
    private stream_?: Socket;
    private timeout?: NodeJS.Timeout;

    public get stream(): Socket {
        if (!this.stream_) {
            throw new NotConnectedError();
        }
        return this.stream_;
    }

    private sendInternal(
        commands: string[] | string,
        cmdConstruct: (cmd: string) => BaseCommand<any>
    ): this {
        [commands].flat().forEach((command) => {
            this.queue.push(cmdConstruct(command));
            this.stream.write(command + '\n');
        });

        this.timeout = setTimeout(() => {
            this.consume(new ErrReply('Command failed'));
        }, 500);

        return this;
    }

    public sendAndParse<T>(
        commands: string | string[],
        cb: MonkeyCallback<T>,
        parser: (data: string | null) => T
    ): this {
        return this.sendInternal(
            commands,
            (cmd) => new ParsableCommand(cmd, cb, parser)
        );
    }

    /**
     * Writes commands to monkey stream.
     * @example
     * monkey.send('key event 24', (err, value, command) => {});
     */
    public send(commands: string[] | string, cb: MonkeyCallback): this {
        return this.sendInternal(commands, (cmd) => new Command(cmd, cb));
    }

    protected hook(): void {
        this.stream.on('data', (data) => {
            clearTimeout(this.timeout);
            return this.parser.parse(data);
        });
        this.stream.on('error', (err) => {
            clearTimeout(this.timeout);
            return this.emit('error', err);
        });
        this.stream.on('end', () => {
            clearTimeout(this.timeout);
            return this.emit('end');
        });
        this.stream.on('finish', () => {
            clearTimeout(this.timeout);
            return this.emit('finish');
        });
        this.parser.on('reply', (reply) => {
            return this.consume(reply);
        });
        this.parser.on('error', (err) => {
            return this.emit('error', err);
        });
    }

    public on(event: 'error', listener: (err: Error) => void): this;
    public on(event: 'end' | 'finish' | 'close', listener: () => void): this;
    public on(
        event: string | symbol,
        listener: (...args: any[]) => void
    ): this {
        return super.on(event, listener);
    }

    private consume(reply: Reply): void {
        const command = this.queue.shift();
        if (!command) {
            this.emit(
                'error',
                new Error('Command queue depleted, but replies still coming in')
            );
            return;
        }

        if (reply.isError()) {
            return command.callback?.(reply.toError(), null, command.command);
        }

        if (command.isParsable()) {
            return command.callback?.(
                null,
                command.parser(reply.value),
                command.command
            );
        }
        command.callback?.(null, reply.value, command.command);
    }

    public connect(param: Socket): this {
        this.stream_ = param;
        this.hook();
        return this;
    }

    public end(cb?: () => void): this {
        clearTimeout(this.timeout);
        this.stream.end(cb);
        return this;
    }

    /**
     * Allows executing commands in a queue.
     * @example
     * monkey
     *      .commandQueue()
     *      .touchDown(100, 0)
     *      .sleep(5)
     *      .touchUp(100, 0)
     *      .execute((err, values) => {
     *          monkey.end();
     *      });
     */
    public commandQueue(): CommandQueue {
        return new CommandQueue(this);
    }
}
