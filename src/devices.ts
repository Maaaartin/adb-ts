import ipRegex from 'ip-regex';
import { DeviceState, IAdbDevice, Reply, UnexpectedDataError } from '.';
import Command from './command';
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
            ['usb', 'product', 'model', 'device', 'transport_id', 'transport']
        );
        acc[key] = value;
        return acc;
    }, {});

function constructDevice(values: string[]): IAdbDevice {
    const [id, state] = values;
    checkValues([id, state], ['id', 'state']);

    const { usb, product, model, device, transport_id } = parseProps(values);
    return {
        id: id || '',
        state:
            /emulator/.test(id) && state === 'device'
                ? 'emulator'
                : (state as DeviceState),
        // TODO check path for local connection
        path: usb || '',
        product: product,
        model: model,
        device: device,
        transportId: transport_id || '',
        transport: ipRegex().test(id) ? 'local' : 'usb'
    };
}

export default abstract class DevicesCommand extends Command {
    protected readOnExecute = true;
    private parse(value: string): IAdbDevice[] {
        const lines = value.split('\n').filter((l) => l !== '');
        return lines.map((line) => constructDevice(line.split(/\s+/)));
    }

    readDevices(): Promise<IAdbDevice[]> {
        return this.parser.readValue().then((value) => {
            return this.parse(value.toString().trim());
        });
    }

    execute(command: string): Promise<IAdbDevice[]> {
        return this.execute_(command).then((reply) => {
            return this.handleReply(
                reply,
                this.readOnExecute
                    ? (): Promise<IAdbDevice[]> => this.readDevices()
                    : []
            );
        });
    }
}
