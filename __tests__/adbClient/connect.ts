import { mockServer } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { promisify } from 'util';

describe('Connect', () => {
    it('Connect to default port', async () => {
        const { port, done } = await mockServer({
            expValue: 'host:connect:127.0.0.1:5555',
            res: 'connected to'
        });
        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.connect('127.0.0.1');
            expect(result).toBe('127.0.0.1:5555');
        } finally {
            await done();
        }
    });

    it('Connect to passed port', async () => {
        const { port, done } = await mockServer({
            expValue: 'host:connect:127.0.0.1:4444',
            res: 'connected to'
        });
        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.connect('127.0.0.1', 4444);
            expect(result).toBe('127.0.0.1:4444');
        } finally {
            await done();
        }
    });

    it('Invalid reply', async () => {
        const { port, done } = await mockServer({
            expValue: 'host:connect:127.0.0.1:4444',
            res: 'invalid'
        });
        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.connect('127.0.0.1', 4444);
            } catch (e) {
                expect(e.message).toBe('invalid');
            }
        } finally {
            await done();
        }
    });

    it('Connect callback overload', async () => {
        const { port, done } = await mockServer({
            expValue: 'host:connect:127.0.0.1:4444',
            res: 'connected to'
        });
        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await promisify<string>((cb) => {
                adb.connect('127.0.0.1', 4444, cb);
            })();
            expect(result).toBe('127.0.0.1:4444');
        } finally {
            await done();
        }
    });
});
