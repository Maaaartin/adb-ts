import crypto from 'crypto';
import { AdbExecError, UnexpectedDataError } from '../../lib/util';
import { Client } from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '1-2-3-4-5';
    });
});

describe('Kill app OKAY tests', () => {
    it('Should execute without error', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(am force-stop package) || echo '1-2-3-4-5'`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.killApp('serial', 'package');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should execute with error', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(am force-stop package) || echo '1-2-3-4-5'`,
                res: 'message \n1-2-3-4-5',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.killApp('serial', 'package')
            ).rejects.toEqual(new AdbExecError('message', 'package'));
        } finally {
            await adbMock.end();
        }
    });
});

describe('Kill app FAIL tests', () => {
    it('Should fail first response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: { raw: true } },
            {
                cmd: `shell:(am force-stop package) || echo '1-2-3-4-5'`,
                res: 'message \n1-2-3-4-5',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.killApp('serial', 'package')
            ).rejects.toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    it('Should fail second response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `fail`,
                res: 'message \n1-2-3-4-5',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.killApp('serial', 'package')
            ).rejects.toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });
});

describe('Kill app unexpected response tests', () => {
    it('Should have unexpected error for first response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true },
                unexpected: true
            },
            {
                cmd: `shell:(am force-stop package) || echo '1-2-3-4-5'`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.killApp('serial', 'package')
            ).rejects.toEqual(new UnexpectedDataError('UNEX', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });

    it('Should have unexpected error for second response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(am force-stop package) || echo '1-2-3-4-5'`,
                res: { raw: true },
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.killApp('serial', 'package')
            ).rejects.toEqual(new UnexpectedDataError('UNEX', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });
});
