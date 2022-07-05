import { DeviceState, IAdbDevice, Reply, UnexpectedDataError } from '.';

import Command from './command';
import ipRegex from 'ip-regex';

export function constructDevice(values: string[]): IAdbDevice {
    const throwUnexpected = (): void => {
        throw new UnexpectedDataError(values.join(' '), 'keys of IAdbDevice');
    };
    const [id, state] = values;
    if (!id || !state) {
        throwUnexpected();
    }
    const propMap = values
        .slice(2)
        .reduce<Record<string, string | undefined>>((acc, curr) => {
            const [key, value] = curr.split(':');
            if (!key || !value) {
                throwUnexpected();
            }
            acc[key] = value;
            return acc;
        }, {});
    return {
        id: id || '',
        state:
            /emulator/.test(id) && state === 'device'
                ? 'emulator'
                : (state as DeviceState),
        // TODO check path for local connection
        path: propMap.usb || '',
        product: propMap.product,
        model: propMap.model,
        device: propMap.device,
        transportId: propMap.transport_id || '',
        transport: ipRegex().test(id) ? 'local' : 'usb'
    };
}

export default abstract class DevicesCommand extends Command {
    private parse(value: string): IAdbDevice[] {
        const lines = value.split('\n').filter((l) => l !== '');
        return lines.map((line) => constructDevice(line.split(/\s+/)));
    }

    private readDevices(): Promise<IAdbDevice[]> {
        return this.parser.readValue().then((value) => {
            return this.parse(value.toString().trim());
        });
    }

    execute(command: string): Promise<IAdbDevice[]> {
        return super.execute_(command).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.readDevices();
                case Reply.FAIL:
                    return this.parser.readError().then((e) => {
                        throw e;
                    });
                default:
                    throw this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
