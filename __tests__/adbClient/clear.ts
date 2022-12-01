import { AdbMock } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { UnexpectedDataError } from '../../lib';

describe('Clear', () => {
    it('OKAY with Success', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm clear com.something`,
                res: 'Success\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.clear('serial', 'com.something');
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with Failed', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm clear com.something`,
                res: 'Failed\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.clear('serial', 'com.something');
        } catch (e) {
            expect(e.message).toBe(
                `Package 'com.something' could not be cleared`
            );
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with Unexpected error', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm clear com.something`,
                res: 'Something\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.clear('serial', 'com.something');
        } catch (e) {
            expect(e).toBeInstanceOf(UnexpectedDataError);
            expect(e.message).toBe(
                `Unexpected 'Something', was expecting /^(Success|Failed)$/`
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'fail',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm clear com.something`,
                res: 'Success\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });

            await adb.clear('serial', 'com.something');
            fail('Expected Failure');
        } catch (e) {
            expect(e).toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `fail`,
                res: 'Success\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });

            await adb.clear('serial', 'com.something');
            fail('Expected Failure');
        } catch (e) {
            expect(e).toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm clear com.something`,
                res: 'Success\n',
                rawRes: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });

            await adb.clear('serial', 'com.something');
            fail('Expected Failure');
        } catch (e) {
            expect(e).toEqual(new UnexpectedDataError('ABCD', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });
});
