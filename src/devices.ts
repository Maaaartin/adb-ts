import { IAdbDevice, Reply } from '.';

import Command from './command';

import ipRegex from 'ip-regex';

export function constructDevice(values: string[]): IAdbDevice {
    const [id, state, path, product, model, device, transportId] = values;
    return {
        id: id || '',
        state:
            /emulator/.test(id) && state === 'device' ? 'emulator' : 'offline',
        path: path || '',
        product: product || '',
        model: model || '',
        device: device || '',
        transportId: transportId || '',
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
