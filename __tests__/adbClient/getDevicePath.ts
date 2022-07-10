import AdbMock from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';

describe('Get device path', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host-serial:serial:get-devpath', res: 'usb:336592896X' }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.getDevicePath('serial');
            expect(result).toBe('usb:336592896X');
        } finally {
            await adbMock.end();
        }
    });
});
