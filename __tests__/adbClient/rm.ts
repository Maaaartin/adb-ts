import crypto from 'crypto';
import { UnexpectedDataError } from '../../lib';
import AdbClient from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '123456';
    });
});
describe('Rm tests', () => {
    it('Should execute without error', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(rm /file) || echo '123456'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.rm('serial', '/file');
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });
});
