import { Client } from '../lib/client';
import { Device } from '../lib/device';

export const getDevice = (port: number): Device => {
    return new Device(new Client({ noAutoStart: true, port }), {
        id: 'serial',
        state: 'device',
        path: 'path',
        device: 'device',
        model: 'model',
        product: 'product',
        transportId: 'transportId',
        transport: 'usb'
    });
};

export const getClientAndDevice = (
    port: number
): {
    device: Device;
    client: Client;
} => {
    const client = new Client({ noAutoStart: true, port });
    const device = new Device(client, {
        id: 'serial',
        state: 'device',
        path: 'path',
        device: 'device',
        model: 'model',
        product: 'product',
        transportId: 'transportId',
        transport: 'usb'
    });
    return { device, client };
};
