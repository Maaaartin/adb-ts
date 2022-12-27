import { Writable } from 'stream';
import fs, { WriteStream } from 'fs';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';
import { BufferWritableMock } from 'stream-mock';

beforeEach(() => {
    jest.spyOn(fs, 'createWriteStream').mockImplementation(() => {
        return new BufferWritableMock() as Writable as WriteStream;
    });
});

describe('Device Push file', () => {
    test('Should push file', async () => {
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
            const result = await getDevice(port).pullFile('/file', '/file');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
