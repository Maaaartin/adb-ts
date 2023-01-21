import { Client } from '../../lib/client';
import { Device } from '../../lib/device';

describe('Adb device constructor tests', () => {
    it('should have the correct properties', () => {
        const device = new Device(new Client(), {
            id: 'test',
            state: 'device',
            path: 'path',
            device: 'device',
            model: 'model',
            product: 'product',
            transportId: 'transportId',
            transport: 'usb'
        });

        expect(device.id).toBe('test');
        expect(device.state).toBe('device');
        expect(device.path).toBe('path');
        expect(device.device).toBe('device');
        expect(device.model).toBe('model');
        expect(device.product).toBe('product');
        expect(device.transportId).toBe('transportId');
        expect(device.transport).toBe('usb');
    });
});
