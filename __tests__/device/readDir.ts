import { Client } from '../../lib/client';
import SyncEntry from '../../lib/sync/entry';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Device Read dir', () => {
    it('Should read dir', async () => {
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
            const [result] = await adb.readDir('serial', '/');
            expect(result).toBeInstanceOf(SyncEntry);
        } finally {
            await adbMock.end();
        }
    });
});
