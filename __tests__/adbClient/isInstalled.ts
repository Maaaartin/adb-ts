import { AdbMock } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { UnexpectedDataError } from '../../lib';

describe('Is installed', () => {
    it('OKAY returning true', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm path com.package 2>/dev/null`,
                res: 'package:\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.isInstalled('serial', 'com.package');
            expect(result).toBe(true);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY returning false', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm path com.package 2>/dev/null`,
                res: 'fail:\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.isInstalled('serial', 'com.package');
            expect(result).toBe(false);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY unexpected input', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm path com.package 2>/dev/null`,
                res: 'badValue\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.isInstalled('serial', 'com.package');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toBeInstanceOf(UnexpectedDataError);
                expect(e.message).toBe(
                    "Unexpected 'badValue', was expecting package:"
                );
            }
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
                cmd: `shell:pm path com.package 2>/dev/null`,
                res: 'package:\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.isInstalled('serial', 'com.package');
                fail('Expected Failure');
            } catch (e: any) {
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
                res: 'package:\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.isInstalled('serial', 'com.package');
                fail('Expected Failure');
            } catch (e: any) {
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
                cmd: `shell:pm path com.package 2>/dev/null`,
                res: 'package:\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.isInstalled('serial', 'com.package');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e.message).toBe(
                    "Unexpected 'UNEX', was expecting OKAY or FAIL"
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
                cmd: `shell:pm path com.package 2>/dev/null`,
                res: 'package:\n',
                rawRes: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.isInstalled('serial', 'com.package');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e.message).toBe(
                    "Unexpected 'UNEX', was expecting OKAY or FAIL"
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
