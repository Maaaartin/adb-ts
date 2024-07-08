import { Writable } from 'stream';
import fs, { WriteStream } from 'fs';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

beforeEach(() => {
    jest.spyOn(fs, 'createWriteStream').mockImplementation(() => {
        return new Writable({
            write: (): void => undefined
        }) as WriteStream;
    });
});

describe('Device Pull file', () => {
    test('Should Pull file', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: {
                    value:
                        'DATA' + buff.toString() + 'dataDONE' + buff.toString(),
                    raw: true
                }
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
