import { AdbClient } from '../../lib/client';
import AdbDevice from '../../lib/device';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Get serial no tests', () => {
    it('Should get serial no', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'shell:getprop ro.serialno', res: 'test', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const serialNo = await new AdbDevice(adb, {
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
