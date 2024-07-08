import crypto from 'crypto';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '1-2-3-4-5';
    });
});

describe('Device mkdir tests', () => {
    it('Should run mkdir command without options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(mkdir /dir) || echo '1-2-3-4-5'`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).mkdir('/dir');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should run mkdir command with options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(mkdir -m 'x' -p /dir) || echo '1-2-3-4-5'`,
                res: { value: 'data', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).mkdir('/dir', {
                parent: true,
                mode: 'x'
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
