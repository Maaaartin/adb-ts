import AdbMock from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';

describe('Screencap', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'shell:echo && screencap -p 2>/dev/null',
                res: `
`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.screenshot('serial');
            expect(result).toEqual(Buffer.from(''));
        } finally {
            await adbMock.end();
        }
    });
});
