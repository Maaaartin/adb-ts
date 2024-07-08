import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';

describe('Wait for', () => {
    it('OKAY with any type', async () => {
        const adbMock = new AdbMock([
            {
                cmd: `host:wait-for-any-device`,
                res: { value: 'OKAY', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'device');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with local type', async () => {
        const adbMock = new AdbMock([
            {
                cmd: `host:wait-for-local-device`,
                res: { value: 'OKAY', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.waitFor('local', 'device');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with usb type', async () => {
        const adbMock = new AdbMock([
            {
                cmd: `host:wait-for-usb-device`,
                res: { value: 'OKAY', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.waitFor('usb', 'device');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with bootloader state', async () => {
        const adbMock = new AdbMock([
            {
                cmd: `host:wait-for-any-bootloader`,
                res: { value: 'OKAY', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'bootloader');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with recovery state', async () => {
        const adbMock = new AdbMock([
            {
                cmd: `host:wait-for-any-recovery`,
                res: { value: 'OKAY', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'recovery');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with rescue state', async () => {
        const adbMock = new AdbMock([
            {
                cmd: `host:wait-for-any-rescue`,
                res: { value: 'OKAY', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'rescue');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with sideload state', async () => {
        const adbMock = new AdbMock([
            {
                cmd: `host:wait-for-any-sideload`,
                res: { value: 'OKAY', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'sideload');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with disconnect state', async () => {
        const adbMock = new AdbMock([
            {
                cmd: `host:wait-for-any-disconnect`,
                res: { value: 'OKAY', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.waitFor('any', 'disconnect');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([{ res: `fail` }]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.waitFor('any', 'disconnect')
            ).rejects.toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: `host:wait-for-any-disconnect`,
                res: { value: 'FAIL0003Err', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.waitFor('any', 'disconnect')
            ).rejects.toEqual(new Error('Err'));
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response with missing error data', async () => {
        const adbMock = new AdbMock([
            {
                cmd: `host:wait-for-any-disconnect`,
                res: { value: 'FAIL', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.waitFor('any', 'disconnect')
            ).rejects.toEqual(new Error('Could not read error'));
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: `host:wait-for-any-disconnect`,
                res: { value: 'UNEX', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.waitFor('any', 'disconnect')
            ).rejects.toEqual(new UnexpectedDataError('UNEX', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });
});
