import crypto from 'crypto';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '1-2-3-4-5';
    });
});

describe('Device rm tests', () => {
    it('Should run rm command without options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(rm /file) || echo '1-2-3-4-5'`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).rm('/file');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should run rm command with options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(rm -f -rR /file) || echo '1-2-3-4-5'`,
                res: { value: 'data', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).rm('/file', {
                force: true,
                recursive: true
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
