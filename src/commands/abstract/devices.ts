import net from 'net';
import { Connection } from '../../connection';
import { DeviceState, IDevice } from '../../util';
import { UnexpectedDataError } from '../../util';
import Command from '../command';
const checkValues = ([_1, _2]: [string, string], expected: string[]): void => {
    if (!_1 || !_2) {
        throw new UnexpectedDataError([_1, _2].join(', '), expected.join(', '));
    }
};

const parseProps = (values: string[]): Record<string, string | undefined> =>
    values.slice(2).reduce<Record<string, string | undefined>>((acc, curr) => {
        const [key, value] = curr.split(':');
        checkValues(
            [key, value],
            ['usb', 'product', 'model', 'device', 'transport_id']
        );
        acc[key] = value;
        return acc;
    }, {});

export function constructDevice(values: string[]): IDevice {
    const [id, state] = values;
    checkValues([id, state], ['id', 'state']);

    const { usb, product, model, device, transport_id } = parseProps(values);
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
        transportId: transport_id as string,
        transport: net.isIPv4(/^(.*?):([0-9]+)$/.exec(id)?.[1] || '')
            ? 'local'
            : 'usb'
    };
}

export default abstract class DevicesCommand extends Command<IDevice[]> {
    // TODO should be abstract
    protected abstract readOnExecute: boolean;
    private command: string;

    constructor(connection: Connection, command: string) {
        super(connection);
        this.command = command;
    }

    private parse(value: string): IDevice[] {
        const lines = value.split('\n').filter((l) => l !== '');
        return lines.map((line) => constructDevice(line.split(/\s+/)));
    }

    public readDevices(): Promise<IDevice[]> {
        return this.parser.readValue().then((value) => {
            return this.parse(value.toString().trim());
        });
    }

    public execute(): Promise<IDevice[]> {
        return this.initExecute(this.command)
            .then(
                this.handleReply(
                    this.readOnExecute
                        ? (): Promise<IDevice[]> => this.readDevices()
                        : []
                )
            )
            .catch((err) => {
                this.endConnection();
                throw err;
            });
    }
}
