import crypto from 'crypto';
import { UnexpectedDataError } from '../../lib';
import AdbClient from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '123456';
    });
});
describe('Rm OKAY tests', () => {
    it('Should execute without parameters', async () => {
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

    // it('Should execute with parameters', async () => {
    //     const adbMock = new AdbMock([
    //         { cmd: 'host:transport:serial', res: null, rawRes: true },
    //         {
    //             cmd: `shell:(rm -f -rR -v /file) || echo '123456'`,
    //             res: null,
    //             rawRes: true
    //         }
    //     ]);
    //     try {
    //         const port = await adbMock.start();
    //         const adb = new AdbClient({ noAutoStart: true, port });
    //         const result = await adb.rm('serial', '/file', {
    //             force: true,
    //             recursive: true,
    //             verbose: true
    //         });
    //         expect(result).toBe(undefined);
    //     } finally {
    //         await adbMock.end();
    //     }
    // });
});
