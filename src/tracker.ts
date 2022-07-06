import { EventEmitter } from 'events';
import { IAdbDevice, PrematureEOFError } from '.';
import AdbClient from './client';
import TrackCommand from './commands/host/trackdevices';
import AdbDevice from './device';

export default class Tracker extends EventEmitter {
    private readonly command: TrackCommand;
    private deviceMap: Record<string, IAdbDevice> | null;
    private readonly client: AdbClient;
    constructor(command: TrackCommand, client: AdbClient) {
        super();
        this.command = command;
        this.deviceMap = null;
        this.client = client;
        this.read()
            .catch((err) => {
                if (err instanceof PrematureEOFError) {
                    this.emit('error', new Error('Connection closed'));
                } else {
                    this.emit('error', err);
                }
            })
            .finally(() => {
                return this.command.parser.end().then(() => this.emit('end'));
            });
    }

    private read(): Promise<void> {
        return this.command.readDevices().then((list: IAdbDevice[]) => {
            this.update(list);
            return this.read();
        });
    }

    private update(list: IAdbDevice[]): void {
        const newMap: Record<string, IAdbDevice> = {};
        for (const d of list) {
            const oldDevice = this.deviceMap?.[d.id];
            if (oldDevice) {
                if (d.state !== oldDevice?.state) {
                    this.emit('change', new AdbDevice(this.client, d));
                }
            } else if (this.deviceMap) {
                this.emit('add', new AdbDevice(this.client, d));
            }
            newMap[d.id] = d;
        }
        for (const d of Object.values(this.deviceMap || {})) {
            if (!newMap[d.id]) {
                this.emit('remove', d);
            }
        }
        this.deviceMap = newMap;
    }

    public end(): Promise<void> {
        this.removeAllListeners();
        return this.command.end();
    }

    on(event: 'add' | 'change', listener: (device: AdbDevice) => void): this;
    on(event: 'remove', listener: (device: IAdbDevice) => void): this;
    on(event: 'end', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }
}
