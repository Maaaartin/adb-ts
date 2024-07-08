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
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: {
                    value:
                        'DENT' + buff.toString() + 'nameDONE' + buff.toString(),
                    raw: true
                }
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
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: {
                    value: 'DENT' + buff.toString() + '.DONE' + buff.toString(),
                    raw: true
                }
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
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: {
                    value:
                        'DENT' + buff.toString() + '..DONE' + buff.toString(),
                    raw: true
                }
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
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'FAIL0003Err', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });

            await expect(() => adb.readDir('serial', '/')).rejects.toEqual(
                new Error('Err')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected data', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'UNEX', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });

            await expect(() => adb.readDir('serial', '/')).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'DENT, DONE or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
