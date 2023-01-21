import { EventEmitter } from 'events';
import { IAdbDevice } from './util';
import { PrematureEOFError } from './util';
import { AdbClient } from './client';
import TrackCommand from './commands/host/trackdevices';
import { AdbDevice } from './device';

export class Tracker extends EventEmitter {
    /** @ignore */
    private readonly command: TrackCommand;
    private ended = false;
    private deviceMap: Map<string, IAdbDevice> | null;
    private readonly client: AdbClient;
    /** @ignore */
    constructor(command: TrackCommand, client: AdbClient) {
        super();
        this.command = command;
        this.deviceMap = null;
        this.client = client;
        this.hook();
    }

    private hook(): void {
        // Listener for error not needed, error is handled in catch for read()
        // this.command.connection.on('error', (err) => this.emit('error', err));
        this.command.connection.once('end', () => this.emit('end'));
        const readErrHandler = (err: unknown): void => {
            if (this.ended) {
                return;
            }
            this.emit(
                'error',
                err instanceof PrematureEOFError
                    ? new Error('Connection closed')
                    : err
            );
        };
        this.read()
            .catch(readErrHandler)
            .finally(() => this.command.parser.end())
            .finally(() => this.command.endConnection())
            .catch((err) => this.emit('error', err));
    }

    private read(): Promise<void> {
        return this.command.readDevices().then((list: IAdbDevice[]) => {
            this.update(list);
            return this.read();
        });
    }

    private update(list: IAdbDevice[]): void {
        const newMap = list.reduce((map, d) => {
            const oldDevice = this.deviceMap?.get(d.id);
            map.set(d.id, d);

            if (oldDevice && d.state !== oldDevice.state) {
                this.emit('change', new AdbDevice(this.client, d));
                return map;
            }

            if (this.deviceMap) {
                this.emit('add', new AdbDevice(this.client, d));
                return map;
            }

            return map;
        }, new Map());

        this.deviceMap?.forEach((d) => {
            if (!newMap.has(d.id)) {
                this.emit('remove', d);
            }
        });

        this.deviceMap = newMap;
    }

    public end(): void {
        this.ended = true;
        this.command.endConnection();
    }

    on(event: 'add' | 'change', listener: (device: AdbDevice) => void): this;
    on(event: 'remove', listener: (device: IAdbDevice) => void): this;
    on(event: 'end', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }
}
