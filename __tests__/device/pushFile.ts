import { Readable } from 'stream';
import fs from 'fs';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

beforeAll(() => {
    jest.spyOn(fs, 'createReadStream').mockImplementation(() => {
        return Readable.from([]) as fs.ReadStream;
    });
});

describe('Device Push file', () => {
    test('Should push file', async () => {
        const buff = Buffer.from([0, 0, 0, 4]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'OKAY' + buff.toString(),
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).pushFile('data', 'dest');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
