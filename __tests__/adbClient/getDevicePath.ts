import { mockServer } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';

describe('Get device path', () => {
    it('OKAY', async () => {
        const { port, done } = await mockServer({
            expValue: 'host-serial:serial:get-devpath',
            res: 'usb:336592896X'
        });
        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.getDevicePath('serial');
            expect(result).toBe('usb:336592896X');
        } finally {
            await done();
        }
    });
});
