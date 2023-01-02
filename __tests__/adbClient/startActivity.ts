import { AdbMock } from '../../mockery/mockAdbServer';
import { AdbClient } from '../../lib/client';

// extends start service tests
describe('Start activity', () => {
    it('OKAY without options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am start -n 'com.my.app/.Activity' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.startActivity(
                'serial',
                'com.my.app',
                'Activity'
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with debug option', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am start -D -n 'com.my.app/.Activity' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.startActivity(
                'serial',
                'com.my.app',
                'Activity',
                { debug: true }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with wait option', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am start -W -n 'com.my.app/.Activity' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.startActivity(
                'serial',
                'com.my.app',
                'Activity',
                { wait: true }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
