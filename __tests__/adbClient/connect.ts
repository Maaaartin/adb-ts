import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';

describe('Connect', () => {
    it('Connect to default port', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:connect:127.0.0.1:5555',
                res: { value: 'connected to' }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.connect('127.0.0.1');
            expect(result).toBe('127.0.0.1:5555');
        } finally {
            await adbMock.end();
        }
    });

    it('Connect to passed port', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:connect:127.0.0.1:4444',
                res: { value: 'connected to' }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.connect('127.0.0.1', 4444);
            expect(result).toBe('127.0.0.1:4444');
        } finally {
            await adbMock.end();
        }
    });

    it('Connect - host containing port', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:connect:127.0.0.1:4444',
                res: { value: 'connected to' }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.connect('127.0.0.1:4444');
            expect(result).toBe('127.0.0.1:4444');
        } finally {
            await adbMock.end();
        }
    });

    it('Invalid reply', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:connect:127.0.0.1:4444', res: { value: 'invalid' } }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(adb.connect('127.0.0.1', 4444)).rejects.toEqual(
                new Error('invalid')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const adbMock = new AdbMock([{ res: 'fail' }]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(adb.connect('127.0.0.1', 4444)).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });
});
