import { Client } from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';
import { UnexpectedDataError } from '../../lib/util';
import { LogcatReader } from '../../lib/logcat/reader';
import { promisify } from 'util';

const logCatRes = Buffer.from([
    0, 0, 66, 0, 28, 0, 212, 0, 0, 0, 212, 0, 0, 0, 32, 109, 160, 99, 108, 188,
    242, 47, 0, 0, 0, 0, 45, 4, 0, 0, 4, 108, 111, 119, 109, 101, 109, 111, 114,
    121, 107, 105, 108, 108, 101, 114, 0, 85, 115, 105, 110, 103, 32, 112, 115,
    105, 32, 109, 111, 110, 105, 116, 111, 114, 115, 32, 102, 111, 114, 32, 109,
    101, 109, 111, 114, 121, 32, 112, 114, 101, 115, 115, 117, 114, 101, 32,
    100, 101, 116, 101, 99, 116, 105, 111, 110, 0, 46, 0, 28, 0, 212, 0, 0, 0,
    212, 0, 0, 0, 32, 109, 160, 99, 204, 6, 47, 48, 0, 0, 0, 0, 45, 4, 0, 0, 4,
    108, 111, 119, 109, 101, 109, 111, 114, 121, 107, 105, 108, 108, 101, 114,
    0, 80, 114, 111, 99, 101, 115, 115, 32, 112, 111, 108, 108, 105, 110, 103,
    32, 105, 115, 32, 115, 117, 112, 112, 111, 114, 116, 101, 100, 0, 72, 0, 28,
    0, 211, 0, 0, 0, 211, 0, 0, 0, 24, 109, 160, 99, 0, 159, 142, 24, 0, 0, 0,
    0, 12, 4, 0, 0, 5, 97, 117, 100
]);

describe('Open logcat OKAY tests', () => {
    it('Should read logs and safely exit', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:echo && logcat -B *:I 2>/dev/null`,
                res: logCatRes,
                rawRes: true
            }
        ]);

        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        const result = await adb.openLogcat('serial');

        expect(result).toBeInstanceOf(LogcatReader);
        // if connection is not ended properly, should throw error
        await promisify<void>((cb) => {
            result.once('end', () => {
                setTimeout(() => {
                    adbMock.end();
                    cb(null);
                }, 500);
            });
        })();
    });

    it('Should clear read logs', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:echo && logcat -c 2>/dev/null && logcat -B *:I 2>/dev/null`,
                res: logCatRes,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.openLogcat('serial', { clear: true });
            expect(result).toBeInstanceOf(LogcatReader);
        } finally {
            await adbMock.end();
        }
    });
});

describe('Open logcat FAIL tests', () => {
    it('Should fail first response', async () => {
        const adbMock = new AdbMock([
            { res: 'fail' },
            {
                cmd: `shell:echo && logcat -B *:I 2>/dev/null`,
                res: logCatRes,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.openLogcat('serial');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            await adbMock.end();
        }
    });

    it('Should second first response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `fail`,
                res: logCatRes,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.openLogcat('serial');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            await adbMock.end();
        }
    });
});

describe('Open logcat unexpected error tests', () => {
    it('Should receive unexpected first response', async () => {
        const adbMock = new AdbMock([
            {
                res: 'unexpected'
            },
            {
                cmd: `shell:echo && logcat -B *:I 2>/dev/null`,
                res: logCatRes,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.openLogcat('serial');
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            await adbMock.end();
        }
    });

    it('Should receive unexpected second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:echo && logcat -B *:I 2>/dev/null`,
                res: logCatRes,
                rawRes: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.openLogcat('serial');
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
