import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';

describe('Pull data from file tests', () => {
    it('OKAY', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'DATA' + buff.toString() + 'dataDONE' + buff.toString(),
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.pullDataFromFile('serial', '/file');
            expect(result).toEqual(Buffer.from('data', 'utf-8'));
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'FAIL' + buff.toString() + 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.pullDataFromFile('serial', '/file')
            ).rejects.toEqual(new Error('data'));
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected error', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'UNEX' + buff.toString() + 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.pullDataFromFile('serial', '/file')
            ).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'DATA, DONE or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
