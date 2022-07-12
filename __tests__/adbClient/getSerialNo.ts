import AdbClient from '../../lib/client';
import AdbMock from '../../mockery/mockAdbServer';

describe('Get serial no', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'shell:getprop ro.serialno', res: 'test', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const serialNo = await adb.getSerialNo('serial');
            expect(serialNo).toBe('test');
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'shell:getprop ro.serialno', res: 'test', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.getSerialNo('fail');
            } catch (e) {
                expect(e.message).toBe('Failure');
            }
        } finally {
            await adbMock.end();
        }
    });
});
