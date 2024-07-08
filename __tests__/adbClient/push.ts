import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { promisify } from 'util';
import { StatsObject, UnexpectedDataError } from '../../lib/util';
import { Readable } from 'stream';
import { SyncMode } from '../../lib/sync';

describe('Adb Push tests', () => {
    it('Should return push transfer without sync mode', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: 'OKAY' + buff.toString(),
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
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

    it('Should emit progress event', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: 'OKAY' + buff.toString(),
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await promisify<StatsObject>(async (cb) => {
                const transfer = await adb.push(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0])),
                    '/sdcard'
                );

                transfer.on('progress', (stats) => {
                    return cb(null, stats);
                });
            })();
            expect(result).toEqual({ bytesTransferred: 4 });
        } finally {
            await adbMock.end();
        }
    });

    it('Should return push transfer with sync mode', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: 'OKAY' + buff.toString(),
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
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

    it('Should handle FAIL response', async () => {
        const buff = Buffer.from([5, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: 'FAIL' + buff.toString() + 'Error',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(
                promisify<void>(async (cb) => {
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
                })
            ).rejects.toEqual(new Error('Error'));
        } finally {
            await adbMock.end();
        }
    });

    it('Should handle unexpected response', async () => {
        const buff = Buffer.from([5, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: 'UNEX' + buff.toString() + 'Error',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(
                promisify<void>(async (cb) => {
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
                })
            ).rejects.toEqual(new UnexpectedDataError('UNEX', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });

    it('No error if transfer is cancelled', async () => {
        const buff = Buffer.from([5, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: 'FAIL' + buff.toString() + 'Error',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });

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
