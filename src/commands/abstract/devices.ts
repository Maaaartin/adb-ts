import net from 'net';
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
    protected readOnExecute = true;
    private parse(value: string): IDevice[] {
        const lines = value.split('\n').filter((l) => l !== '');
        return lines.map((line) => constructDevice(line.split(/\s+/)));
    }

    readDevices(): Promise<IDevice[]> {
        return this.parser.readValue().then((value) => {
            return this.parse(value.toString().trim());
        });
    }

    execute(command: string): Promise<IDevice[]> {
        return this.initExecute(command)
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
