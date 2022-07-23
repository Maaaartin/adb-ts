import AdbMock from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';

describe('Forward tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host-serial:serial:forward:tcp:9222;localabstract:chrome_devtools_remote',
                res: 'OKAY',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.forward(
                'serial',
                'tcp:9222',
                'localabstract:chrome_devtools_remote'
            );
            expect(result).toBe(void 0);
        } finally {
            await adbMock.end();
        }
    });
});
