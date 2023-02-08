import crypto from 'crypto';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '123456';
    });
});

describe('Device mv tests', () => {
    it('Should run mv command without options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(mv /file /other) || echo '123456'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).mv('/file', '/other');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should run mv command with options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(mv -f -n /file /other) || echo '123456'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).mv('/file', '/other', {
                force: true,
                noClobber: true
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
