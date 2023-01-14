import crypto from 'crypto';
import { AdbExecError } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '123456';
    });
});

describe('Shell tests', () => {
    it('Should execute without error', async () => {
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
            const result = await getDevice(port).shell('"one && "two"');
            expect(result).toBe('0');
        } finally {
            await adbMock.end();
        }
    });

    it('Should execute with error', async () => {
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
            try {
                await getDevice(port).shell('cmd');
                fail('Expected failure');
            } catch (e) {
                expect(e).toEqual(new AdbExecError('message', 'cmd'));
            }
        } finally {
            await adbMock.end();
        }
    });
});
