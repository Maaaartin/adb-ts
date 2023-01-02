import { AdbClient } from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Version tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock({ cmd: 'host:version', res: '0029' });
        try {
            const port = await adbMock.start();
            const client = new AdbClient({
                noAutoStart: true,
                port
            });
            const version = await client.version();
            expect(version).toBe(29);
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const adbMock = new AdbMock({
            cmd: 'fail',
            res: 'host:something'
        });
        try {
            const port = await adbMock.start();
            const client = new AdbClient({
                noAutoStart: true,
                port
            });
            try {
                await client.version();
                fail('Expected Failure');
            } catch (e: any) {
                expect(e.message).toBe('Failure');
            }
        } finally {
            await adbMock.end();
        }
    });

    it('unexpected', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:version',
            res: null,
            unexpected: true
        });
        try {
            const port = await adbMock.start();
            const client = new AdbClient({
                noAutoStart: true,
                port
            });
            const version = await client.version();
            expect(version).toBe(NaN);
        } finally {
            await adbMock.end();
        }
    });
});
