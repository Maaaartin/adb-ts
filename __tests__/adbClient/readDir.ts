import { AdbMock } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import SyncEntry from '../../lib/sync/entry';
import { UnexpectedDataError } from '../../lib';

describe('Read dir', () => {
    test('DENT', async () => {
        const buff = Buffer.from([
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 0
        ]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'DENT' + buff.toString() + 'nameDONE' + buff.toString(),
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.readDir('serial', '/');
            expect(result[0]).toBeInstanceOf(SyncEntry);
        } finally {
            await adbMock.end();
        }
    });

    test('DENT with dot as name', async () => {
        const buff = Buffer.from([
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0
        ]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'DENT' + buff.toString() + '.DONE' + buff.toString(),
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.readDir('serial', '/');
            expect(result).toHaveLength(0);
        } finally {
            await adbMock.end();
        }
    });

    test('DENT with two dots as name', async () => {
        const buff = Buffer.from([
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0
        ]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'DENT' + buff.toString() + '..DONE' + buff.toString(),
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.readDir('serial', '/');
            expect(result).toHaveLength(0);
        } finally {
            await adbMock.end();
        }
    });

    test('FAIL', async () => {
        const buff = Buffer.from([
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0
        ]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'FAIL0003Err',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.readDir('serial', '/');
            fail('Expected failure');
        } catch (e) {
            expect(e).toEqual(new Error('Err'));
        } finally {
            await adbMock.end();
        }
    });

    test('FAIL', async () => {
        const buff = Buffer.from([
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0
        ]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'ABCD',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.readDir('serial', '/');
            fail('Expected failure');
        } catch (e) {
            expect(e).toEqual(
                new UnexpectedDataError('ABCD', 'DENT, DONE or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
