import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';

describe('Clear', () => {
    it('OKAY with Success', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:pm clear com.something`,
                res: { value: 'Success\n', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.clear('serial', 'com.something');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with Failed', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:pm clear com.something`,
                res: { value: 'Failed\n', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await adb.clear('serial', 'com.something');
        } catch (e: unknown) {
            expect(e).toEqual(
                new Error(`Package 'com.something' could not be cleared`)
            );
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with Unexpected error', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:pm clear com.something`,
                res: { value: 'Something\n', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await adb.clear('serial', 'com.something');
        } catch (e: unknown) {
            expect(e).toEqual(
                new UnexpectedDataError('Something', '/^(Success|Failed)$/')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: 'fail'
            },
            {
                cmd: `shell:pm clear com.something`,
                res: 'fail'
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(adb.clear('serial', 'com.something')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:pm clear com.something`,
                res: 'fail'
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(adb.clear('serial', 'com.something')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:pm clear com.something`,
                res: 'unexpected'
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(adb.clear('serial', 'com.something')).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
