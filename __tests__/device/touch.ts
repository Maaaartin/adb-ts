import crypto from 'crypto';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '123456';
    });
});

describe('Device touch tests', () => {
    it('Should run touch command without options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(touch /file) || echo '123456'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).touch('/file');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should run touch command with options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(touch -c -h -r '/file' /file) || echo '123456'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).touch('/file', {
                noCreate: true,
                symlink: true,
                reference: '/file'
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
