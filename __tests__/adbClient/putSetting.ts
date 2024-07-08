import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';

describe('Put setting tests', () => {
    it('OKAY with empty string', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings put system 'setting' ''`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.putSetting(
                'serial',
                'system',
                'setting',
                ''
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with single quotation marks', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings put system 'setting' ''"'"'text'"'"''`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.putSetting(
                'serial',
                'system',
                'setting',
                `'text'`
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with double quotation marks', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings put system 'setting' '"text"'`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.putSetting(
                'serial',
                'system',
                'setting',
                `"text"`
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with undefined value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings put system 'setting' ''`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.putSetting(
                'serial',
                'system',
                'setting',
                undefined
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with boolean value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings put system 'setting' false`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.putSetting(
                'serial',
                'system',
                'setting',
                false
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with int value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings put system 'setting' 0`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.putSetting(
                'serial',
                'system',
                'setting',
                0
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with float value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings put system 'setting' 0.1`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.putSetting(
                'serial',
                'system',
                'setting',
                0.1
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('No error for white space response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings put system 'setting' ''`,
                res: ' \r\n\t ',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.putSetting(
                'serial',
                'system',
                'setting',
                undefined
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Error for non empty response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings put system 'setting' ''`,
                res: 'Failed',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.putSetting('serial', 'system', 'setting', undefined)
            ).rejects.toEqual(new Error('Failed'));
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: { raw: true } },
            {
                cmd: `shell:settings put system 'setting' ''`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.putSetting('serial', 'system', 'setting', '')
            ).rejects.toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `fail`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.putSetting('serial', 'system', 'setting', '')
            ).rejects.toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected first response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true },
                unexpected: true
            },
            {
                cmd: `shell:settings put system 'setting' ''`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.putSetting('serial', 'system', 'setting', '')
            ).rejects.toEqual(new UnexpectedDataError('UNEX', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:settings put system 'setting' ''`,
                res: { raw: true },
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.putSetting('serial', 'system', 'setting', '')
            ).rejects.toEqual(new UnexpectedDataError('UNEX', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });
});
