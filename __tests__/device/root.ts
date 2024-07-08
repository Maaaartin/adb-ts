import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Root tests', () => {
    it('Should root device', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'root:',
                res: { value: 'restarting adbd as root', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).root();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should get error on invalid response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'root:', res: { value: 'invalid', raw: true } }
        ]);
        try {
            const port = await adbMock.start();
            await expect(() => getDevice(port).root()).rejects.toEqual(
                new Error('invalid')
            );
        } finally {
            await adbMock.end();
        }
    });
});
