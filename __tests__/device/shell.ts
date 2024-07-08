import crypto from 'crypto';
import { AdbExecError } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '1-2-3-4-5';
    });
});

describe('Shell tests', () => {
    it('Should execute without error', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:("one && "two") || echo '1-2-3-4-5'`,
                res: { value: '0', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).shell('"one && "two"');
            expect(result).toBe('0');
        } finally {
            await adbMock.end();
        }
    });

    it('Should execute with error', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(cmd) || echo '1-2-3-4-5'`,
                res: { value: 'message \n1-2-3-4-5', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            await expect(() => getDevice(port).shell('cmd')).rejects.toEqual(
                new AdbExecError('message', 'cmd')
            );
        } finally {
            await adbMock.end();
        }
    });
});
