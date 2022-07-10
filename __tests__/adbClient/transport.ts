import AdbClient from '../../lib/client';
import Connection from '../../lib/connection';
import AdbMock from '../../mockery/mockAdbServer';

describe('Transport tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock({ cmd: 'host:transport:1234', res: null });
        try {
            const port = await adbMock.start();
            const client = new AdbClient({
                noAutoStart: true,
                port
            });
            const connection = await client.transport('1234');
            expect(connection).toBeInstanceOf(Connection);
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const adbMock = new AdbMock({ cmd: 'host:transport:1234', res: null });
        try {
            const port = await adbMock.start();
            const client = new AdbClient({
                noAutoStart: true,
                port
            });
            try {
                await client.transport('5678');
            } catch (e) {
                expect(e.message).toBe('Failure');
            }
        } finally {
            await adbMock.end();
        }
    });

    it('unexpected', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:transport:1234',
            res: null,
            unexpected: true
        });
        try {
            const port = await adbMock.start();
            const client = new AdbClient({
                noAutoStart: true,
                port
            });
            try {
                await client.transport('5678');
            } catch (e) {
                expect(e.message).toBe(
                    "Unexpected 'ABCD', was expecting OKAY or FAIL"
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
