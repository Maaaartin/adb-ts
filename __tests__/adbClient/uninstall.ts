import AdbMock from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { UnexpectedDataError } from '../../lib';

describe('Uninstall', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm uninstall com.package`,
                res: 'Success\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.uninstall('serial', 'com.package');
            expect(result).toBe(void 0);
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
                cmd: `shell:pm uninstall com.package`,
                res: 'Success\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.uninstall('serial', 'com.package');
                fail('Expected Failure');
            } catch (e) {
                expect(e.message).toBe('Failure');
            }
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
            try {
                await adb.uninstall('serial', 'com.package');
                fail('Expected Failure');
            } catch (e) {
                expect(e.message).toBe('Failure');
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
                cmd: `shell:pm uninstall com.package`,
                res: 'Success\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.uninstall('serial', 'com.package');
                fail('Expected Failure');
            } catch (e) {
                expect(e.message).toBe(
                    "Unexpected 'ABCD', was expecting OKAY or FAIL"
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
                cmd: `shell:pm uninstall com.package`,
                res: 'Success\n',
                rawRes: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.uninstall('serial', 'com.package');
                fail('Expected Failure');
            } catch (e) {
                expect(e.message).toBe(
                    "Unexpected 'ABCD', was expecting OKAY or FAIL"
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});