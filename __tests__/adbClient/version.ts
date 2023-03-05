import { Client } from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Version tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock({ cmd: 'host:version', res: '0029' });
        try {
            const port = await adbMock.start();
            const client = new Client({
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
            const client = new Client({
                noAutoStart: true,
                port
            });
            await expect(() => client.version()).rejects.toThrowError(
                new Error('Failure')
            );
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
            const client = new Client({
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
