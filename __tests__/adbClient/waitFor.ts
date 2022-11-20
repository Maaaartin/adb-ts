import AdbMock from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { FailError, PrematureEOFError } from '../../lib';

describe('Wait for', () => {
    it('OKAY with any type', async () => {
        const adbMock = new AdbMock([
            { cmd: `host:wait-for-any-device`, res: 'OKAY', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'device');
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });
});
