import { AdbMock } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { promisify } from 'util';
import { FailError, UnexpectedDataError } from '../../lib';

describe('Pull tests', () => {
    test('OKAY', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'DATA' + buff.toString() + 'dataDONE' + buff.toString(),
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await promisify<string | null>(async (cb) => {
                const transfer = await adb.pull('serial', '/');
                let acc = '';
                transfer.on('error', (err) => cb(err, null));
                transfer.on('data', (data) => {
                    acc += data.toString();
                });
                transfer.on('end', () => {
                    cb(null, acc);
                });
            })();
            expect(result).toBe('data');
        } finally {
            await adbMock.end();
        }
    });

    test('FAIL', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'FAIL' + buff.toString() + 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await promisify<string | null>(async (cb) => {
                    const transfer = await adb.pull('serial', '/');
                    let acc = '';
                    transfer.on('error', (err) => cb(err, null));
                    transfer.on('data', (data) => {
                        acc += data.toString();
                    });
                    transfer.on('end', () => {
                        cb(null, acc);
                    });
                })();
                fail('Expected failure');
            } catch (e) {
                expect(e).toEqual(new FailError('data'));
            }
        } finally {
            await adbMock.end();
        }
    });

    test('Unexpected error', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'ABCD' + buff.toString() + 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await promisify<string | null>(async (cb) => {
                    const transfer = await adb.pull('serial', '/');
                    let acc = '';
                    transfer.on('error', (err) => cb(err, null));
                    transfer.on('data', (data) => {
                        acc += data.toString();
                    });
                    transfer.on('end', () => {
                        cb(null, acc);
                    });
                })();
                fail('Expected failure');
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError('ABCD', 'DATA, DONE or FAIL')
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
