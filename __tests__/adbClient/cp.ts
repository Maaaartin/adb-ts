import crypto from 'crypto';
import { UnexpectedDataError } from '../../lib/util/errors';
import AdbClient from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '123456';
    });
});

describe('Cp OKAY tests', () => {
    it('Should execute without parameters', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(cp /file /other) || echo '123456'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.cp('serial', '/file', '/other');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should execute with simple parameters without archive', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(cp -n -s -l -P -L -H -r -d -p -F -f -u -t /file /other) || echo '123456'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
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
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(cp -n -s -l -P -L -H -a -F -f -u -t /file /other) || echo '123456'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
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
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(cp --preserve=motcx /file /other) || echo '123456'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
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
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(cp --preserve=a /file /other) || echo '123456'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
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
            { cmd: 'fail', res: null, rawRes: true },
            {
                cmd: `shell:(cp /file /other) || echo '123456'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.cp('serial', '/file', '/other');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(new Error('Failure'));
            }
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
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.cp('serial', '/file', '/other');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(new Error('Failure'));
            }
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
                res: null,
                rawRes: true,
                unexpected: true
            },
            {
                cmd: `shell:(cp /file /other) || echo '123456'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.cp('serial', '/file', '/other');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
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
                cmd: `shell:(cp /file /other) || echo '123456'`,
                res: null,
                rawRes: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.mv('serial', '/file', '/other');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
