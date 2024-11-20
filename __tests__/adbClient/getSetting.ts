import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Get setting OKAY tests', () => {
    it('Should get string value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings get system 'prop'`,
                res: { value: `string\n`, raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.getSetting('serial', 'system', 'prop');
            expect(result).toBe('string');
        } finally {
            await adbMock.end();
        }
    });

    it('Should get number value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings get system 'prop'`,
                res: { value: `0\n`, raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.getSetting('serial', 'system', 'prop');
            expect(result).toBe(0);
        } finally {
            await adbMock.end();
        }
    });

    it('Should get boolean value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings get system 'prop'`,
                res: { value: `false\n`, raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.getSetting('serial', 'system', 'prop');
            expect(result).toBe(false);
        } finally {
            await adbMock.end();
        }
    });

    it('Should get null value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings get system 'prop'`,
                res: { value: `null\n`, raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.getSetting('serial', 'system', 'prop');
            expect(result).toBeNull();
        } finally {
            await adbMock.end();
        }
    });

    it('Should get undefined value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings get system 'prop'`,
                res: { value: `\n`, raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.getSetting('serial', 'system', 'prop');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should get date value', async () => {
        const date = new Date();
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings get system 'prop'`,
                res: { value: `${date.toISOString()}\n`, raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.getSetting('serial', 'system', 'prop');
            expect(result).toEqual(date.toISOString());
        } finally {
            await adbMock.end();
        }
    });
});

describe('Get setting FAIL tests', () => {
    it('Should fail first response', async () => {
        const adbMock = new AdbMock([
            { res: 'fail' },
            {
                cmd: `shell:settings get system 'prop'`,
                res: { value: `\n`, raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(
                adb.getSetting('serial', 'system', 'prop')
            ).rejects.toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    it('Should second first response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            { res: `fail` }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(
                adb.getSetting('serial', 'system', 'prop')
            ).rejects.toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });
});

describe('Get setting unexpected response tests', () => {
    it('Should have unexpected first response', async () => {
        const adbMock = new AdbMock([
            {
                res: 'unexpected'
            },
            {
                cmd: `shell:settings get system 'prop'`,
                res: { value: `\n` }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(
                adb.getSetting('serial', 'system', 'prop')
            ).rejects.toEqual(new UnexpectedDataError('UNEX', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });

    it('Should have unexpected second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            { res: 'unexpected' }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(
                adb.getSetting('serial', 'system', 'prop')
            ).rejects.toEqual(new UnexpectedDataError('UNEX', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });
});
