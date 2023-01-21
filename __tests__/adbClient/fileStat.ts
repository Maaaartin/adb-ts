import crypto from 'crypto';
import { AdbExecError, UnexpectedDataError } from '../../lib/util';
import { Client } from '../../lib/client';
import { FileStat } from '../../lib/filestats';
import { AdbMock } from '../../mockery/mockAdbServer';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '123456';
    });
});
describe('File stat OKAY tests', () => {
    it('Should execute successfully', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(stat -c "%a\\_%A\\_%b\\_%B\\_%C\\_%d\\_%D\\_%f\\_%F\\_%g\\_%G\\_%h\\_%i\\_%m\\_%n\\_%N\\_%o\\_%s\\_%t\\_%T\\_%u\\_%U\\_%x\\_%X\\_%y\\_%Y\\_%z\\_%Z" /file) || echo '123456'`,
                res: '660\\_-rw-rw----\\_8\\_512\\_u:object_r:fuse:s0\\_80\\_50\\_81b0\\_regular empty file\\_1023\\_media_rw\\_1\\_303154\\_/storage/emulated\\_/sdcard/file\\_/sdcard/file\\_4096\\_0\\_0\\_0\\_10145\\_u0_a145\\_2022-12-15 16:40:46.871000000 +0100\\_1671118846\\_2022-12-15 16:40:46.871000000 +0100\\_1671118846\\_2022-12-15 21:33:17.585000000 +0100\\_1671136397',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.fileStat('serial', '/file');
            expect(result).toBeInstanceOf(FileStat);
            expect(result.abits).toBe(432);
            expect(result.aflags).toBe('-rw-rw----');
            expect(result.blocks).toBe(8);
            expect(result.bytes).toBe(512);
            expect(result.seccon).toBe('u:object_r:fuse:s0');
            expect(result.dev).toBe(80);
            expect(result.mode).toBe(33200);
            expect(result.type).toBe('regular empty file');
            expect(result.gid).toBe(1023);
            expect(result.gname).toBe('media_rw');
            expect(result.nlink).toBe(1);
            expect(result.ino).toBe(303154);
            expect(result.moutpoint).toBe('/storage/emulated');
            expect(result.name).toBe('/sdcard/file');
            expect(result.lname).toBe('/sdcard/file');
            expect(result.blksize).toBe(4096);
            expect(result.size).toBe(0);
            expect(result.dTypeMajor).toBe(0);
            expect(result.dTypeMinor).toBe(0);
            expect(result.uid).toBe(10145);
            expect(result.uname).toBe('u0_a145');
            expect(result.atime).toEqual(new Date('2022-12-15T15:40:46.871Z'));
            expect(result.atimeMs).toBe(1671118846);
            expect(result.mtime).toEqual(new Date('2022-12-15T15:40:46.871Z'));
            expect(result.mtimeMs).toBe(1671118846);
            expect(result.ctime).toEqual(new Date('2022-12-15T20:33:17.585Z'));
            expect(result.ctimeMs).toBe(1671136397);
        } finally {
            await adbMock.end();
        }
    });

    it('Should execute and get error', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(stat -c "%a\\_%A\\_%b\\_%B\\_%C\\_%d\\_%D\\_%f\\_%F\\_%g\\_%G\\_%h\\_%i\\_%m\\_%n\\_%N\\_%o\\_%s\\_%t\\_%T\\_%u\\_%U\\_%x\\_%X\\_%y\\_%Y\\_%z\\_%Z" /file) || echo '123456'`,
                res: 'message 123456',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await adb.fileStat('serial', '/file');
        } catch (e: any) {
            expect(e.message).toBe('message');
            expect(e.command).toBe(
                `stat -c "%a\\_%A\\_%b\\_%B\\_%C\\_%d\\_%D\\_%f\\_%F\\_%g\\_%G\\_%h\\_%i\\_%m\\_%n\\_%N\\_%o\\_%s\\_%t\\_%T\\_%u\\_%U\\_%x\\_%X\\_%y\\_%Y\\_%z\\_%Z" /file`
            );
            expect(e).toBeInstanceOf(AdbExecError);
        } finally {
            await adbMock.end();
        }
    });
});

describe('File stat FAIL tests', () => {
    it('First response should FAIL', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: null, rawRes: true },
            {
                cmd: `shell:(stat -c "%a\\_%A\\_%b\\_%B\\_%C\\_%d\\_%D\\_%f\\_%F\\_%g\\_%G\\_%h\\_%i\\_%m\\_%n\\_%N\\_%o\\_%s\\_%t\\_%T\\_%u\\_%U\\_%x\\_%X\\_%y\\_%Y\\_%z\\_%Z" /file) || echo '123456'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.fileStat('serial', '/file');
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
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.fileStat('serial', '/file');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            await adbMock.end();
        }
    });
});

describe('File stat unexpected tests', () => {
    it('Should throw unexpected error for first response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true,
                unexpected: true
            },
            {
                cmd: `shell:(stat -c "%a\\_%A\\_%b\\_%B\\_%C\\_%d\\_%D\\_%f\\_%F\\_%g\\_%G\\_%h\\_%i\\_%m\\_%n\\_%N\\_%o\\_%s\\_%t\\_%T\\_%u\\_%U\\_%x\\_%X\\_%y\\_%Y\\_%z\\_%Z" /file) || echo '123456'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.fileStat('serial', '/file');
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
                cmd: `shell:(stat -c "%a\\_%A\\_%b\\_%B\\_%C\\_%d\\_%D\\_%f\\_%F\\_%g\\_%G\\_%h\\_%i\\_%m\\_%n\\_%N\\_%o\\_%s\\_%t\\_%T\\_%u\\_%U\\_%x\\_%X\\_%y\\_%Y\\_%z\\_%Z" /file) || echo '123456'`,
                res: null,
                rawRes: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.fileStat('serial', '/file');
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
