import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';

describe('Shutdown', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'shell:reboot -p', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.shutdown('serial');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: null, rawRes: true },
            { cmd: 'shell:reboot -p', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.shutdown('serial');
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
            { cmd: 'fail', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.shutdown('serial');
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
            { cmd: 'shell:reboot -p', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.shutdown('serial');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(
                    new Error("Unexpected 'UNEX', was expecting OKAY or FAIL")
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
                cmd: 'shell:reboot -p',
                res: null,
                rawRes: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.shutdown('serial');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(
                    new Error("Unexpected 'UNEX', was expecting OKAY or FAIL")
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
