import { AdbMock } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { promisify } from 'util';
import { FailError, UnexpectedDataError } from '../../lib/util/errors';
import { Readable } from 'stream';

describe('Push tests', () => {
    test('OKAY', async () => {
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

    test('FAIL', async () => {
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

    test('Unexpected error', async () => {
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
