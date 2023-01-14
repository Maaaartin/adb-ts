import { AdbMock } from '../../mockery/mockAdbServer';
import { AdbClient } from '../../lib/client';
import { promisify } from 'util';
import { FailError, UnexpectedDataError } from '../../lib/util';
import { Readable } from 'stream';
import { SyncMode } from '../../lib/sync';

describe('Adb Push tests', () => {
    test('Should return push transfer without sync mode', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'OKAY' + buff.toString(),
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await promisify<void>(async (cb) => {
                const transfer = await adb.push(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0])),
                    '/sdcard'
                );

                transfer.on('error', (err) => {
                    return cb(err);
                });

                transfer.on('end', () => {
                    cb(null);
                });
            })();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    test('Should return push transfer with sync mode', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'OKAY' + buff.toString(),
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await promisify<void>(async (cb) => {
                const transfer = await adb.push(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0])),
                    '/sdcard',
                    SyncMode.DATA_MAX_LENGTH
                );

                transfer.on('error', (err) => {
                    return cb(err);
                });

                transfer.on('end', () => {
                    cb(null);
                });
            })();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    test('Should handle FAIL response', async () => {
        const buff = Buffer.from([5, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'FAIL' + buff.toString() + 'Error',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await promisify<void>(async (cb) => {
                    const transfer = await adb.push(
                        'serial',
                        Readable.from(Buffer.from([1, 0, 0, 0])),
                        '/sdcard'
                    );

                    transfer.on('error', (err) => {
                        return cb(err);
                    });

                    transfer.on('end', () => {
                        cb(null);
                    });
                })();
                fail('Expected failure');
            } catch (e: any) {
                expect(e).toEqual(new FailError('Error'));
            }
        } finally {
            await adbMock.end();
        }
    });

    test('Should handle unexpected response', async () => {
        const buff = Buffer.from([5, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'UNEX' + buff.toString() + 'Error',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await promisify<void>(async (cb) => {
                    const transfer = await adb.push(
                        'serial',
                        Readable.from(Buffer.from([1, 0, 0, 0])),
                        '/sdcard'
                    );

                    transfer.on('error', (err) => {
                        return cb(err);
                    });

                    transfer.on('end', () => {
                        cb(null);
                    });
                })();
                fail('Expected failure');
            } catch (e: any) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            await adbMock.end();
        }
    });

    test('No error if transfer is cancelled', async () => {
        const buff = Buffer.from([5, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'FAIL' + buff.toString() + 'Error',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });

            const result = await promisify<void>(async (cb) => {
                const transfer = await adb.push(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0])),
                    '/sdcard'
                );

                transfer.on('cancel', () => {
                    cb(null);
                });
                transfer.cancel();
                transfer.on('error', (err) => {
                    return cb(err);
                });
            })();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
