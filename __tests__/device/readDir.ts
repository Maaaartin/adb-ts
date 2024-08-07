import { Client } from '../../lib/client';
import SyncEntry from '../../lib/sync/entry';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Device Read dir', () => {
    it('Should read dir', async () => {
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
            const [result] = await adb.readDir('serial', '/');
            expect(result).toBeInstanceOf(SyncEntry);
        } finally {
            await adbMock.end();
        }
    });
});
