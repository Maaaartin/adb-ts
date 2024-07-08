import net from 'net';
import { Connection } from '../../connection';
import { DeviceState, IDevice } from '../../util';
import { UnexpectedDataError } from '../../util';
import Command from '../command';

const expectedKeys = [
    'usb',
    'product',
    'model',
    'device',
    'transport_id'
] as const;

const throwUnexpected = (received: string): never => {
    throw new UnexpectedDataError(
        received,
        `<id> <state> <${expectedKeys.join('|')}>:<value>`
    );
};

const parseProps = (values: string[]): Record<string, string | undefined> => {
    return values.reduce<Record<string, string | undefined>>((acc, curr) => {
        const match = curr.match(
            new RegExp(`(${expectedKeys.join('|')}):(\\S+)(?=\\s|$)`)
        );
        if (!match) {
            return acc;
        }
        const [key, value] = match.slice(1);
        acc[key] = value;
        return acc;
    }, {});
};

export function constructDevice(line: string): IDevice {
    const values = line.split(/\s+/);
    const [id, state] = values;
    if (!id || !state) {
        return throwUnexpected(line);
    }

    const { usb, product, model, device, transport_id } = parseProps(
        values.slice(2)
    );
    if (typeof transport_id === 'undefined') return throwUnexpected(line);
    return {
        id: id,
        state:
            /emulator/.test(id) && state === 'device'
                ? 'emulator'
                : (state as DeviceState),
        path: usb,
        product: product,
        model: model,
        device: device,
        transportId: transport_id,
        transport: net.isIPv4(/^(.*?):([0-9]+)$/.exec(id)?.[1] || '')
            ? 'local'
            : 'usb'
    };
}

export default abstract class DevicesCommand extends Command<IDevice[]> {
    protected abstract readOnExecute: boolean;
    private command: string;

    constructor(connection: Connection, command: string) {
        super(connection);
        this.command = command;
    }

    private parse(value: string): IDevice[] {
        return value.split('\n').filter(Boolean).map(constructDevice);
    }

    public async readDevices(): Promise<IDevice[]> {
        const value = (await this.parser.readValue()).toString().trim();
        return this.parse(value);
    }

    public async execute(): Promise<IDevice[]> {
        try {
            await this.initAndValidateReply(this.command);
            return this.readOnExecute ? await this.readDevices() : [];
        } catch (err) {
            this.endConnection();
            throw err;
        }
    }
}
