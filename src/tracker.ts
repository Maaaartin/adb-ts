import { EventEmitter } from 'events';
import { IDevice } from './util';
import { PrematureEOFError } from './util';
import { Client } from './client';
import TrackCommand from './commands/host/trackdevices';
import { Device } from './device';

export class Tracker extends EventEmitter {
    /** @ignore */
    private readonly command: TrackCommand;
    private ended = false;
    private deviceMap: Map<string, IDevice> | null;
    private readonly client: Client;
    /** @ignore */
    constructor(command: TrackCommand, client: Client) {
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
        return this.command.readDevices().then((list: IDevice[]) => {
            this.update(list);
            return this.read();
        });
    }

    private update(list: IDevice[]): void {
        const newMap = list.reduce((map, d) => {
            const oldDevice = this.deviceMap?.get(d.id);
            map.set(d.id, d);

            if (oldDevice && d.state !== oldDevice.state) {
                this.emit('change', new Device(this.client, d));
                return map;
            }

            if (this.deviceMap) {
                this.emit('add', new Device(this.client, d));
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

    on(event: 'add' | 'change', listener: (device: Device) => void): this;
    on(event: 'remove', listener: (device: IDevice) => void): this;
    on(event: 'end', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }
}
