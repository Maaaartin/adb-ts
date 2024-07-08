import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';

describe('Get device path', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host-serial:serial:get-devpath',
                res: { value: 'usb:336592896X' }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.getDevicePath('serial');
            expect(result).toBe('usb:336592896X');
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const adbMock = new AdbMock([{ res: 'fail' }]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(adb.getDevicePath('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });
});
