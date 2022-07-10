import { AdbMock } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';

describe('IP address', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: "shell:ip route | awk '{ print $9 }'",
                res: '127.0.0.1',
                rawRes: true
            }
        ]);

        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.getIpAddress('serial');
            expect(result).toBe('127.0.0.1');
        } finally {
            await adbMock.end();
        }
    });
});
