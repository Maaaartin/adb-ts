import { AdbMock } from '../../mockery/mockAdbServer';
import { AdbClient } from '../../lib/client';

describe('Usb', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `usb:`,
                res: 'restarting in',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.usb('serial');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL with non matching response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `usb:`,
                res: 'error',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.usb('serial');
                fail('Expected failure');
            } catch (e: any) {
                expect(e).toEqual(new Error('error'));
            }
        } finally {
            await adbMock.end();
        }
    });
});
