import crypto from 'crypto';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '123456';
    });
});

describe('Device kill app tests', () => {
    it('Should kill app', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(am force-stop package) || echo '123456'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).killApp('package');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
