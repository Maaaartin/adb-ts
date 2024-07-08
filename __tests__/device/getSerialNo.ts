import { Client } from '../../lib/client';
import { Device } from '../../lib/device';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Get serial no tests', () => {
    it('Should get serial no', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'shell:getprop ro.serialno',
                res: { value: 'test', raw: true }
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
            }).getSerialNo();
            expect(serialNo).toBe('test');
        } finally {
            await adbMock.end();
        }
    });
});
