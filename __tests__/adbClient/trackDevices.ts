import { promisify } from 'util';
import { AdbClient } from '../../lib/client';
import AdbDevice from '../../lib/device';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Track devices', () => {
    it('Add', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:track-devices-l',
            res: null
        });

        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            const result = await promisify((cb) => {
                tracker.on('add', (d) => {
                    cb(null, d);
                });
                tracker.on('error', (err) => {
                    cb(err, undefined);
                });
                adbMock.forceWrite(
                    'b137f5dc               unauthorized usb:337641472X transport_id:1'
                );
            })();
            try {
                expect(result).toEqual(
                    new AdbDevice(adb, {
                        id: 'b137f5dc',
                        state: 'unauthorized',
                        path: '337641472X',
                        device: undefined,
                        model: undefined,
                        product: undefined,
                        transportId: '1',
                        transport: 'usb'
                    })
                );
            } finally {
                tracker.end();
            }
        } finally {
            await adbMock.end();
        }
    });

    it('Remove', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:track-devices-l',
            res: 'b137f5dc               unauthorized usb:337641472X transport_id:1'
        });

        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            const result = await promisify((cb) => {
                tracker.on('remove', (d) => {
                    cb(null, d);
                });
                tracker.on('error', (err) => {
                    cb(err, null);
                });

                adbMock.forceWrite('');
            })();
            try {
                expect(result).toEqual({
                    id: 'b137f5dc',
                    state: 'unauthorized',
                    path: '337641472X',
                    device: undefined,
                    model: undefined,
                    product: undefined,
                    transportId: '1',
                    transport: 'usb'
                });
            } finally {
                tracker.end();
            }
        } finally {
            await adbMock.end();
        }
    });

    it('Change', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:track-devices-l',
            res: 'b137f5dc               unauthorized usb:337641472X transport_id:1'
        });

        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            const result = await promisify((cb) => {
                tracker.on('change', (d) => {
                    cb(null, d);
                });
                tracker.on('error', (err) => {
                    cb(err, undefined);
                });

                adbMock.forceWriteData(
                    'b137f5dc               device usb:337641472X transport_id:1'
                );
            })();
            try {
                expect(result).toEqual(
                    new AdbDevice(adb, {
                        id: 'b137f5dc',
                        state: 'device',
                        path: '337641472X',
                        device: undefined,
                        model: undefined,
                        product: undefined,
                        transportId: '1',
                        transport: 'usb'
                    })
                );
            } finally {
                tracker.end();
            }
        } finally {
            await adbMock.end();
        }
    });

    it('Error', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:track-devices-l',
            res: 'b137f5dc               unauthorized usb337641472X transport_id:1'
        });

        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            const result = await promisify((cb) => {
                tracker.on('error', (err) => {
                    cb(null, err);
                });
            })();
            try {
                expect(result).toBeInstanceOf(Error);
            } finally {
                tracker.end();
            }
        } finally {
            await adbMock.end();
        }
    });

    it('End after error', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:track-devices-l',
            res: 'b137f5dc               unauthorized usb337641472X transport_id:1'
        });

        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            const result = await promisify((cb) => {
                tracker.on('error', () => null);
                tracker.on('end', () => {
                    cb(null, undefined);
                });
            })();
            try {
                expect(result).toBeUndefined();
            } finally {
                tracker.end();
            }
        } finally {
            await adbMock.end();
        }
    });

    it('End', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:track-devices-l',
            res: null
        });

        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            const result = await promisify(async (cb) => {
                tracker.on('error', () => {
                    return null;
                });
                tracker.on('end', () => {
                    cb(null, undefined);
                });
                tracker.end();
            })();
            try {
                expect(result).toBeUndefined();
            } finally {
                tracker.end();
            }
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const adbMock = new AdbMock({
            cmd: 'fail',
            res: 'b137f5dc               unauthorized usb337641472X transport_id:1'
        });

        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.trackDevices();
                fail('Expected Failure');
            } catch (e: any) {
                expect(e.message).toBe('Failure');
            }
        } finally {
            await adbMock.end();
        }
    });
});
