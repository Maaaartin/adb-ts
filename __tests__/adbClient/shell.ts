import crypto from 'crypto';
import { ShellExecError } from '../../lib';
import AdbClient from '../../lib/client';
import AdbMock from '../../mockery/mockAdbServer';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '123456';
    });
});

describe('Shell tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:("one && "two") || echo '123456'`,
                res: '0',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.shell('serial', '"one && "two"');
            expect(result).toBe('0');
        } finally {
            await adbMock.end();
        }
    });

    it('Returned error', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(cmd) || echo '123456'`,
                res: 'message \n123456',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.shell('serial', 'cmd');
                fail('Expected failure');
            } catch (e) {
                expect(e).toBeInstanceOf(ShellExecError);
                expect(e.message).toBe('message');
                expect(e.command).toBe('cmd');
            }
        } finally {
            await adbMock.end();
        }
    });
});
