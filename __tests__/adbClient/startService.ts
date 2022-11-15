import AdbMock from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { UnexpectedDataError } from '../../lib';

describe('Start service', () => {
    it('OKAY without options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service'
            );
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with user', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -n 'com.my.app/.Service' --user 1`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { user: 1 }
            );
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with user', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -d 'data' -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { data: 'data' }
            );
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });
});
