import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import SyncEntry from '../../lib/sync/entry';
import { UnexpectedDataError } from '../../lib/util';

describe('Read dir', () => {
    it('DENT', async () => {
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
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.readDir('serial', '/');
            expect(result[0]).toBeInstanceOf(SyncEntry);
        } finally {
            await adbMock.end();
        }
    });

    it('DENT with dot as name', async () => {
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
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.readDir('serial', '/');
            expect(result).toHaveLength(0);
        } finally {
            await adbMock.end();
        }
    });

    it('DENT with two dots as name', async () => {
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
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.readDir('serial', '/');
            expect(result).toHaveLength(0);
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
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
            const adb = new Client({ noAutoStart: true, port });

            await expect(() => adb.readDir('serial', '/')).rejects.toThrowError(
                new Error('Err')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected data', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'UNEX',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });

            await expect(() => adb.readDir('serial', '/')).rejects.toThrowError(
                new UnexpectedDataError('UNEX', 'DENT, DONE or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
