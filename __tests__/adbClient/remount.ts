import AdbMock from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';

describe('Remount', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'remount:', res: '', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.remount('serial');
            expect(result).toBe(void 0);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY not running as root', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'remount:', res: 'Not running as root', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.remount('serial');
                fail('Expected Failure');
            } catch (e) {
                expect(e).toEqual(new Error('Not running as root'));
            }
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY inaccessible', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'remount:', res: 'inaccessible', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.remount('serial');
                fail('Expected Failure');
            } catch (e) {
                expect(e).toEqual(new Error('inaccessible'));
            }
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY not found', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'remount:', res: 'not found', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.remount('serial');
                fail('Expected Failure');
            } catch (e) {
                expect(e).toEqual(new Error('not found'));
            }
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: null, rawRes: true },
            { cmd: 'remount:', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.remount('serial');
                fail('Expected Failure');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'fail', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.remount('serial');
                fail('Expected Failure');
            } catch (e) {
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
            { cmd: 'remount:', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.remount('serial');
                fail('Expected Failure');
            } catch (e) {
                expect(e).toEqual(
                    new Error("Unexpected 'ABCD', was expecting OKAY or FAIL")
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
            { cmd: 'remount:', res: null, rawRes: true, unexpected: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.remount('serial');
                fail('Expected Failure');
            } catch (e) {
                expect(e).toEqual(
                    new Error("Unexpected 'ABCD', was expecting OKAY or FAIL")
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
