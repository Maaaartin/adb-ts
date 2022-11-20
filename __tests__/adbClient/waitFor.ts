import AdbMock from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { FailError, PrematureEOFError } from '../../lib';

describe('Wait for', () => {
    it('OKAY with any type', async () => {
        const adbMock = new AdbMock([
            { cmd: `host:wait-for-any-device`, res: 'OKAY', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'device');
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with local type', async () => {
        const adbMock = new AdbMock([
            { cmd: `host:wait-for-local-device`, res: 'OKAY', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.waitFor('local', 'device');
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with usb type', async () => {
        const adbMock = new AdbMock([
            { cmd: `host:wait-for-usb-device`, res: 'OKAY', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.waitFor('usb', 'device');
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with any type', async () => {
        const adbMock = new AdbMock([
            { cmd: `host:wait-for-any-device`, res: 'OKAY', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'device');
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with bootloader state', async () => {
        const adbMock = new AdbMock([
            { cmd: `host:wait-for-any-bootloader`, res: 'OKAY', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'bootloader');
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with recovery state', async () => {
        const adbMock = new AdbMock([
            { cmd: `host:wait-for-any-recovery`, res: 'OKAY', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'recovery');
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with rescue state', async () => {
        const adbMock = new AdbMock([
            { cmd: `host:wait-for-any-rescue`, res: 'OKAY', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'rescue');
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with sideload state', async () => {
        const adbMock = new AdbMock([
            { cmd: `host:wait-for-any-sideload`, res: 'OKAY', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'sideload');
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with disconnect state', async () => {
        const adbMock = new AdbMock([
            { cmd: `host:wait-for-any-disconnect`, res: 'OKAY', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'disconnect');
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            { cmd: `fail`, res: 'OKAY', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.waitFor('any', 'disconnect');
                fail('Expected failure');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: `host:wait-for-any-disconnect`,
                res: 'FAIL0003Err',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.waitFor('any', 'disconnect');
                fail('Expected failure');
            } catch (e) {
                expect(e).toEqual(new Error('Err'));
            }
        } finally {
            await adbMock.end();
        }
    });
});
