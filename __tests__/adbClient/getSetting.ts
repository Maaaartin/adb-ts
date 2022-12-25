import AdbClient from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Get setting OKAY tests', () => {
    it('Should get string value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:settings get system 'prop'`,
                res: `string\n`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.getSetting('serial', 'system', 'prop');
            expect(result).toBe('string');
        } finally {
            await adbMock.end();
        }
    });

    it('Should get number value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:settings get system 'prop'`,
                res: `0\n`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.getSetting('serial', 'system', 'prop');
            expect(result).toBe(0);
        } finally {
            await adbMock.end();
        }
    });

    it('Should get boolean value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:settings get system 'prop'`,
                res: `false\n`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.getSetting('serial', 'system', 'prop');
            expect(result).toBe(false);
        } finally {
            await adbMock.end();
        }
    });

    it('Should get null value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:settings get system 'prop'`,
                res: `null\n`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.getSetting('serial', 'system', 'prop');
            expect(result).toBeNull();
        } finally {
            await adbMock.end();
        }
    });

    it('Should get undefined value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:settings get system 'prop'`,
                res: `\n`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.getSetting('serial', 'system', 'prop');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should get date value', async () => {
        const date = new Date();
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:settings get system 'prop'`,
                res: `${date.toISOString()}\n`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.getSetting('serial', 'system', 'prop');
            expect(result).toEqual(date);
        } finally {
            await adbMock.end();
        }
    });
});
