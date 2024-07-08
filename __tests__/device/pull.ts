import { AdbMock } from '../../mockery/mockAdbServer';
import { promisify } from 'util';
import { getDevice } from '../../mockery/testDevice';

describe('Device Pull tests', () => {
    it('Should pull file', async () => {
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
            const result = await promisify<Buffer>(async (cb) => {
                const transfer = await getDevice(port).pull('/');
                let acc = Buffer.alloc(0);
                transfer.on('error', (err) => cb(err, Buffer.alloc(0)));
                transfer.on('data', (data) => {
                    acc = Buffer.concat([acc, data as Buffer]);
                });
                transfer.on('end', () => {
                    cb(null, acc);
                });
            })();
            expect(result).toEqual(Buffer.from('data'));
        } finally {
            await adbMock.end();
        }
    });
});
