import crypto from 'crypto';
import { UnexpectedDataError } from '../../lib/util';
import { Client } from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';
import { promisify } from 'util';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '123456';
    });
});

describe('Mv OKAY tests', () => {
    it('Should execute without parameters', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(mv /file /other) || echo '123456'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.mv('serial', '/file', '/other');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should execute callback overload without options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(mv /file /other) || echo '123456'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await promisify<void>((cb) =>
                adb.mv('serial', '/file', '/other', cb)
            )();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should execute with options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(mv -f -n /file /other) || echo '123456'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.mv('serial', '/file', '/other', {
                force: true,
                noClobber: true
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should execute callback overload with parameters', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(mv -f -n /file /other) || echo '123456'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await promisify<void>((cb) =>
                adb.mv(
                    'serial',
                    '/file',
                    '/other',
                    {
                        force: true,
                        noClobber: true
                    },
                    cb
                )
            )();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});

describe('Mv FAIL tests', () => {
    it('First response should FAIL', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: null, rawRes: true },
            {
                cmd: `shell:(mv /file /other) || echo '123456'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.mv('serial', '/file', '/other')
            ).rejects.toThrowError(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    it('Second response should FAIL', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `fail`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.mv('serial', '/file', '/other')
            ).rejects.toThrowError(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });
});

describe('Mv unexpected tests', () => {
    it('Should throw unexpected error for first response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true,
                unexpected: true
            },
            {
                cmd: `shell:(mv /file /other) || echo '123456'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.mv('serial', '/file', '/other')
            ).rejects.toThrowError(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Should throw unexpected error for second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:(mv /file /other) || echo '123456'`,
                res: null,
                rawRes: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.mv('serial', '/file', '/other')
            ).rejects.toThrowError(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
