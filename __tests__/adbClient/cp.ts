import crypto from 'crypto';
import { UnexpectedDataError } from '../../lib/util';
import { Client } from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '1-2-3-4-5';
    });
});

describe('Cp OKAY tests', () => {
    it('Should execute without options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(cp /file /other) || echo '1-2-3-4-5'`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.cp('serial', '/file', '/other');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should execute with simple parameters without archive', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(cp -F -H -L -P -d -f -l -n -p -r -s -t -u /file /other) || echo '1-2-3-4-5'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.cp('serial', '/file', '/other', {
                noClobber: true,
                symlink: true,
                recursive: true,
                hardLink: true,
                noDereference: true,
                noFollowSymlinks: true,
                followAllSymlinks: true,
                followListedSymlinks: true,
                delFirst: true,
                delDest: true,
                update: true,
                preserveTimestamps: true,
                copyToTarget: true
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should execute with simple parameters with archive', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(cp -F -H -L -P -a -f -l -n -s -t -u /file /other) || echo '1-2-3-4-5'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.cp('serial', '/file', '/other', {
                noClobber: true,
                symlink: true,
                archive: true,
                recursive: true,
                hardLink: true,
                noDereference: true,
                noFollowSymlinks: true,
                followAllSymlinks: true,
                followListedSymlinks: true,
                delFirst: true,
                delDest: true,
                update: true,
                preserveTimestamps: true,
                copyToTarget: true
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should execute with preserve option without all', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(cp --preserve=motcx /file /other) || echo '1-2-3-4-5'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.cp('serial', '/file', '/other', {
                preserve: {
                    mode: true,
                    ownership: true,
                    timestamps: true,
                    context: true,
                    xattr: true
                }
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should execute with preserve option with all', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:(cp --preserve=a /file /other) || echo '1-2-3-4-5'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.cp('serial', '/file', '/other', {
                preserve: {
                    all: true,
                    mode: true,
                    ownership: true,
                    timestamps: true,
                    context: true,
                    xattr: true
                }
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});

describe('Cp FAIL tests', () => {
    it('First response should FAIL', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: { raw: true } },
            {
                cmd: `shell:(cp /file /other) || echo '1-2-3-4-5'`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.cp('serial', '/file', '/other')
            ).rejects.toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    it('Second response should FAIL', async () => {
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
                adb.cp('serial', '/file', '/other')
            ).rejects.toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });
});

describe('Cp unexpected tests', () => {
    it('Should throw unexpected error for first response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true },
                unexpected: true
            },
            {
                cmd: `shell:(cp /file /other) || echo '1-2-3-4-5'`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.cp('serial', '/file', '/other')
            ).rejects.toEqual(new UnexpectedDataError('UNEX', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });

    it('Should throw unexpected error for second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:(cp /file /other) || echo '1-2-3-4-5'`,
                res: { raw: true },
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.cp('serial', '/file', '/other')
            ).rejects.toEqual(new UnexpectedDataError('UNEX', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });
});
