import { Client } from '../../lib/client';
import { Device } from '../../lib/device';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Get device path tests', () => {
    it('Should get device path', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host-serial:serial:get-devpath',
                res: { value: 'usb:336592896X' }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const serialNo = await new Device(adb, {
                id: 'serial',
                state: 'device',
                path: 'path',
                device: 'device',
                model: 'model',
                product: 'product',
                transportId: 'transportId',
                transport: 'usb'
            }).getDevicePath();
            expect(serialNo).toBe('usb:336592896X');
        } finally {
            await adbMock.end();
        }
    });
});
