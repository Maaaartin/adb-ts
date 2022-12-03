import { AdbMockDouble } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { UnexpectedDataError } from '../../lib';
import Monkey from '../../lib/monkey/client';

describe('Open Monkey tests', () => {
    test('OKAY', async () => {
        const adbMock = new AdbMockDouble([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port ${1080} -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });

            const res = await adb.openMonkey('serial');
            expect(res).toBeInstanceOf(Monkey);
            res.end();
        } finally {
            await adbMock.end();
        }
    });

    test('FAIL first response', async () => {
        const adbMock = new AdbMockDouble([
            { cmd: 'fail', res: null, rawRes: true },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.openMonkey('serial');
            fail('Expected Failure');
        } catch (e) {
            expect(e).toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    test('FAIL second response', async () => {
        const adbMock = new AdbMockDouble([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'fail', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.openMonkey('serial');
            fail('Expected Failure');
        } catch (e) {
            expect(e).toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    test('FAIL third response', async () => {
        const adbMock = new AdbMockDouble([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `fail`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.openMonkey('serial');
            fail('Expected Failure');
        } catch (e) {
            expect(e).toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    test('FAIL fourth response', async () => {
        const adbMock = new AdbMockDouble([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'fail', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.openMonkey('serial');
            fail('Expected Failure');
        } catch (e) {
            expect(e).toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    test('FAIL fifth response', async () => {
        const adbMock = new AdbMockDouble([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'fail', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.openMonkey('serial');
            fail('Expected Failure');
        } catch (e) {
            expect(e).toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });
});
