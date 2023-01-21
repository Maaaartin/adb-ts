import { AdbClient } from '../lib/client';
import { AdbDevice } from '../lib/device';

export const getDevice = (port: number): AdbDevice => {
    return new AdbDevice(new AdbClient({ noAutoStart: true, port }), {
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
    device: AdbDevice;
    client: AdbClient;
} => {
    const client = new AdbClient({ noAutoStart: true, port });
    const device = new AdbDevice(client, {
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
