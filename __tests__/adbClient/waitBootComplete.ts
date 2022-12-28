import { AdbMock } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { PrematureEOFError } from '../../lib/util/errors';

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
            const adb = new AdbClient({ noAutoStart: true, port });
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
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.waitBootComplete('serial');
                fail('Expected failure');
            } catch (e: any) {
                expect(e).toBeInstanceOf(PrematureEOFError);
            }
        } finally {
            await adbMock.end();
        }
    });
});
