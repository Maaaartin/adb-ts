import { AdbMock } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { FailError } from '../../lib/util/errors';

describe('Tcpip', () => {
    it('OKAY with default port', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `tcpip:5555`,
                res: 'restarting in',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.tcpip('serial');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with passed port', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `tcpip:3333`,
                res: 'restarting in',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.tcpip('serial', 3333);
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL with non matching response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `tcpip:5555`,
                res: 'error',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.tcpip('serial');
                fail('Expected failure');
            } catch (e: any) {
                expect(e).toEqual(new FailError('error'));
            }
        } finally {
            await adbMock.end();
        }
    });
});
