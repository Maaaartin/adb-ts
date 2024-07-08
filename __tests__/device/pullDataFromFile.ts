import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Device Pull data from file tests', () => {
    it('Should pull data from file', async () => {
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
            const result = await getDevice(port).pullDataFromFile('/file');
            expect(result).toEqual(Buffer.from('data', 'utf-8'));
        } finally {
            await adbMock.end();
        }
    });
});
