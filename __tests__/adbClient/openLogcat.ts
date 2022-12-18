import AdbClient from '../../src/client';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Open logcat OKAY tests', () => {
    it('Should read logs', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:echo && logcat -B *:I 2>/dev/null`,
                res: 'lkjlkjjkjkl',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.openLogcat('serial');
            result.on('entry', (entry) => {
                console.log(entry);
            });
            result.on('error', (err) => {
                console.log(err);
            });
            result.on('end', () => {
                console.log('end');
            });
            // adbMock.forceWrite('data');
            // expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
