import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { PrematureEOFError } from '../../lib/util';

describe('Wait boot complete', () => {
    it('OKAY with matching response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'shell:while getprop sys.boot_completed 2>/dev/null; do sleep 1; done',
                res: '2\n1\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.waitBootComplete('serial');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL with non matching response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'shell:while getprop sys.boot_completed 2>/dev/null; do sleep 1; done',
                res: '2\n3\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.waitBootComplete('serial')
            ).rejects.toBeInstanceOf(PrematureEOFError);
        } finally {
            await adbMock.end();
        }
    });
});
