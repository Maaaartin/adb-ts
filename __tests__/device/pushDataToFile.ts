import { Readable } from 'stream';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Device Push data to file tests', () => {
    it('Success with string data', async () => {
        const buff = Buffer.from([0, 0, 0, 4]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'OKAY' + buff.toString(), raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).pushDataToFile('data', 'dest');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Success with buffer data', async () => {
        const buff = Buffer.from([0, 0, 0, 4]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'OKAY' + buff.toString(), raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).pushDataToFile(
                Buffer.from('data', 'utf-8'),
                'dest'
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Success with readable data', async () => {
        const buff = Buffer.from([0, 0, 0, 4]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'OKAY' + buff.toString(), raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).pushDataToFile(
                Readable.from('data'),
                'dest'
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
