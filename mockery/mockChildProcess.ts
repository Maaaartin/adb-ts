/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
    MessageOptions,
    SendHandle,
    Serializable,
    ChildProcess
} from 'child_process';
import { Pipe, Readable, Writable } from 'stream';

export class ChildProcessMock implements ChildProcess {
    stdin!: Writable | null;
    stdout!: Readable | null;
    stderr!: Readable | null;
    channel?: Pipe | null | undefined;
    stdio!: [
        Writable | null,
        Readable | null,
        Readable | null,
        Writable | Readable | null | undefined,
        Writable | Readable | null | undefined
    ];
    killed!: boolean;
    pid!: number;
    connected!: boolean;
    exitCode!: number | null;
    signalCode!: NodeJS.Signals | null;
    spawnargs!: string[];
    spawnfile!: string;
    kill(): boolean {
        throw new Error('Method not implemented.');
    }
    send(
        message: Serializable,
        callback?: ((error: Error | null) => void) | undefined
    ): boolean;
    send(
        message: Serializable,
        sendHandle?: SendHandle | undefined,
        callback?: ((error: Error | null) => void) | undefined
    ): boolean;
    send(
        message: Serializable,
        sendHandle?: SendHandle | undefined,
        options?: MessageOptions | undefined,
        callback?: ((error: Error | null) => void) | undefined
    ): boolean;
    send(): boolean {
        throw new Error('Method not implemented.');
    }
    disconnect(): void {
        throw new Error('Method not implemented.');
    }
    unref(): void {
        throw new Error('Method not implemented.');
    }
    ref(): void {
        throw new Error('Method not implemented.');
    }
    addListener(event: string, listener: (...args: any[]) => void): this;
    addListener(
        event: 'close',
        listener: (code: number | null, signal: NodeJS.Signals | null) => void
    ): this;
    addListener(event: 'disconnect', listener: () => void): this;
    addListener(event: 'error', listener: (err: Error) => void): this;
    addListener(
        event: 'exit',
        listener: (code: number | null, signal: NodeJS.Signals | null) => void
    ): this;
    addListener(
        event: 'message',
        listener: (message: Serializable, sendHandle: SendHandle) => void
    ): this;
    addListener(): this {
        throw new Error('Method not implemented.');
    }
    emit(): boolean;
    emit(
        event: 'close',
        code: number | null,
        signal: NodeJS.Signals | null
    ): boolean;
    emit(event: 'disconnect'): boolean;
    emit(event: 'error', err: Error): boolean;
    emit(
        event: 'exit',
        code: number | null,
        signal: NodeJS.Signals | null
    ): boolean;
    emit(
        event: 'message',
        message: Serializable,
        sendHandle: SendHandle
    ): boolean;
    emit(): boolean {
        throw new Error('Method not implemented.');
    }
    on(event: string, listener: (...args: any[]) => void): this;
    on(
        event: 'close',
        listener: (code: number | null, signal: NodeJS.Signals | null) => void
    ): this;
    on(event: 'disconnect', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(
        event: 'exit',
        listener: (code: number | null, signal: NodeJS.Signals | null) => void
    ): this;
    on(
        event: 'message',
        listener: (message: Serializable, sendHandle: SendHandle) => void
    ): this;
    on(): this {
        throw new Error('Method not implemented.');
    }
    once(event: string, listener: (...args: any[]) => void): this;
    once(
        event: 'close',
        listener: (code: number | null, signal: NodeJS.Signals | null) => void
    ): this;
    once(event: 'disconnect', listener: () => void): this;
    once(event: 'error', listener: (err: Error) => void): this;
    once(
        event: 'exit',
        listener: (code: number | null, signal: NodeJS.Signals | null) => void
    ): this;
    once(
        event: 'message',
        listener: (message: Serializable, sendHandle: SendHandle) => void
    ): this;
    once(): this {
        throw new Error('Method not implemented.');
    }
    prependListener(event: string, listener: (...args: any[]) => void): this;
    prependListener(
        event: 'close',
        listener: (code: number | null, signal: NodeJS.Signals | null) => void
    ): this;
    prependListener(event: 'disconnect', listener: () => void): this;
    prependListener(event: 'error', listener: (err: Error) => void): this;
    prependListener(
        event: 'exit',
        listener: (code: number | null, signal: NodeJS.Signals | null) => void
    ): this;
    prependListener(
        event: 'message',
        listener: (message: Serializable, sendHandle: SendHandle) => void
    ): this;
    prependListener(): this {
        throw new Error('Method not implemented.');
    }
    prependOnceListener(
        event: string,
        listener: (...args: any[]) => void
    ): this;
    prependOnceListener(
        event: 'close',
        listener: (code: number | null, signal: NodeJS.Signals | null) => void
    ): this;
    prependOnceListener(event: 'disconnect', listener: () => void): this;
    prependOnceListener(event: 'error', listener: (err: Error) => void): this;
    prependOnceListener(
        event: 'exit',
        listener: (code: number | null, signal: NodeJS.Signals | null) => void
    ): this;
    prependOnceListener(
        event: 'message',
        listener: (message: Serializable, sendHandle: SendHandle) => void
    ): this;
    prependOnceListener(): this {
        throw new Error('Method not implemented.');
    }
    removeListener(): this {
        throw new Error('Method not implemented.');
    }
    off(): this {
        throw new Error('Method not implemented.');
    }
    removeAllListeners(): this {
        throw new Error('Method not implemented.');
    }
    setMaxListeners(): this {
        throw new Error('Method not implemented.');
    }
    getMaxListeners(): number {
        throw new Error('Method not implemented.');
    }
    listeners(): Function[] {
        throw new Error('Method not implemented.');
    }
    rawListeners(): Function[] {
        throw new Error('Method not implemented.');
    }
    listenerCount(): number {
        throw new Error('Method not implemented.');
    }
    eventNames(): (string | symbol)[] {
        throw new Error('Method not implemented.');
    }
}
