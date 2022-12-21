import { AdbMock } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util/errors';

describe('List Reverses', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'reverse:list-forward',
                res: `host-19 localabstract:chrome_devtools_remote tcp:9222
host-19 localabstract:chrome_devtools_remote tcp:9223`
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.listReverses('serial');
            expect(result).toEqual([
                {
                    host: 'host-19',
                    local: 'tcp:9222',
                    remote: 'localabstract:chrome_devtools_remote'
                },
                {
                    host: 'host-19',
                    local: 'tcp:9223',
                    remote: 'localabstract:chrome_devtools_remote'
                }
            ]);
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: null, rawRes: true },
            {
                cmd: 'reverse:list-forward',
                res: `host-19 localabstract:chrome_devtools_remote tcp:9222
host-19 localabstract:chrome_devtools_remote tcp:9223`
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.listReverses('serial');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'fail',
                res: `host-19 localabstract:chrome_devtools_remote tcp:9222
host-19 localabstract:chrome_devtools_remote tcp:9223`
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.listReverses('serial');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected first response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true,
                unexpected: true
            },
            {
                cmd: 'reverse:list-forward',
                res: `host-19 localabstract:chrome_devtools_remote tcp:9222
host-19 localabstract:chrome_devtools_remote tcp:9223`
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.listReverses('serial');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: 'reverse:list-forward',
                res: `host-19 localabstract:chrome_devtools_remote tcp:9222
host-19 localabstract:chrome_devtools_remote tcp:9223`,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.listReverses('serial');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
