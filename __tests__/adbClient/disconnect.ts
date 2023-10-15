import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { promisify } from 'util';

describe('Disconnect', () => {
    it('Disconnect from default port', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:disconnect:127.0.0.1:5555',
                res: 'disconnected'
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.disconnect('127.0.0.1');
            expect(result).toBe('127.0.0.1:5555');
        } finally {
            await adbMock.end();
        }
    });

    it('Disconnect from passed port', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:disconnect:127.0.0.1:4444',
                res: 'disconnected'
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.disconnect('127.0.0.1', 4444);
            expect(result).toBe('127.0.0.1:4444');
        } finally {
            await adbMock.end();
        }
    });

    it('Disconnect - host containing port', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:disconnect:127.0.0.1:4444',
                res: 'disconnected'
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.disconnect('127.0.0.1:4444');
            expect(result).toBe('127.0.0.1:4444');
        } finally {
            await adbMock.end();
        }
    });

    it('Invalid reply', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:disconnect:127.0.0.1:4444',
                res: 'invalid'
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.disconnect('127.0.0.1', 4444);
            } catch (e: unknown) {
                expect(e).toEqual(new Error('invalid'));
            }
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'test',
                res: null
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(adb.disconnect('127.0.0.1', 4444)).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Connect callback overload', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:disconnect:127.0.0.1:4444',
                res: 'disconnected'
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await promisify<string>((cb) => {
                adb.disconnect('127.0.0.1', 4444, cb);
            })();
            expect(result).toBe('127.0.0.1:4444');
        } finally {
            await adbMock.end();
        }
    });
});
