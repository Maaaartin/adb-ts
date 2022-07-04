import AdbClient from '../../lib/client';
import { mockServer } from '../../mockery/mockAdbServer';

describe('Version tests', () => {
    it('OKAY', async () => {
        const { port, done } = await mockServer({
            expValue: 'host:version',
            res: '0029'
        });
        try {
            const client = new AdbClient({
                noAutoStart: true,
                port
            });
            const version = await client.version();
            expect(version).toBe(29);
        } finally {
            await done();
        }
    });

    it('FAIL', async () => {
        const { port, done } = await mockServer({ expValue: 'host:something' });
        try {
            const client = new AdbClient({
                noAutoStart: true,
                port
            });
            try {
                await client.version();
            } catch (e) {
                expect(e.message).toBe('Failure');
            }
        } finally {
            await done();
        }
    });

    it('unexpected', async () => {
        const { port, done } = await mockServer({
            expValue: 'host:version',
            unexpected: true
        });
        try {
            const client = new AdbClient({
                noAutoStart: true,
                port
            });
            const version = await client.version();
            expect(version).toBe(NaN);
        } finally {
            await done();
        }
    });
});
