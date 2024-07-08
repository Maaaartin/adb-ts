import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';
import { Readable } from 'stream';

describe('Push data to file', () => {
    it('Success with string data', async () => {
        const buff = Buffer.from([0, 0, 0, 4]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'OKAY' + buff.toString(), raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.pushDataToFile('serial', 'data', 'dest');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Success with buffer data', async () => {
        const buff = Buffer.from([0, 0, 0, 4]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'OKAY' + buff.toString(), raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.pushDataToFile(
                'serial',
                Buffer.from('data', 'utf-8'),
                'dest'
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Success with readable data', async () => {
        const buff = Buffer.from([0, 0, 0, 4]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'OKAY' + buff.toString(), raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.pushDataToFile(
                'serial',
                Readable.from('data'),
                'dest'
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const buff = Buffer.from([5, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'FAIL' + buff.toString() + 'Error', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.pushDataToFile('serial', Readable.from('data'), 'dest')
            ).rejects.toEqual(new Error('Error'));
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected error', async () => {
        const buff = Buffer.from([5, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'UNEX' + buff.toString() + 'Error', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.pushDataToFile('serial', Readable.from('data'), 'dest')
            ).rejects.toEqual(new UnexpectedDataError('UNEX', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });
});
