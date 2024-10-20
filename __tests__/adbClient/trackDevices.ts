import { promisify } from 'util';
import { Client } from '../../lib/client';
import { Device } from '../../lib/device';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Track devices', () => {
    it('Should command with autoEnd false', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:track-devices-l'
        });

        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        const tracker = await adb.trackDevices();
        try {
            expect(tracker['command'].autoEnd).toBe(false);
        } finally {
            tracker.end();
            await adbMock.end();
        }
    });
    it('Should have device map of null at initialization', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:track-devices-l'
        });

        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        const tracker = await adb.trackDevices();
        try {
            expect(tracker['deviceMap']).toBeNull();
        } finally {
            tracker.end();
            await adbMock.end();
        }
    });

    it('Add', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:track-devices-l'
        });

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
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
                    new Device(adb, {
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

    it('Devices emit add only once for the same device', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:track-devices-l'
        });
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            let addCount = 0;
            const result = await promisify((cb) => {
                tracker.on('add', () => {
                    addCount++;
                });
                tracker.on('error', (err) => {
                    cb(err, null);
                });
                adbMock.forceWriteData(
                    'b137f5dc               unauthorized usb:337641472X transport_id:1\n'
                );
                adbMock.forceWriteData(
                    'b137f5dc               unauthorized usb:337641472X transport_id:1\n'
                );
                setTimeout(() => {
                    cb(null, addCount);
                }, 1000);
            })();
            try {
                expect(result).toBe(1);
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
            res: {
                value: 'b137f5dc               unauthorized usb:337641472X transport_id:1'
            }
        });

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
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
                expect(
                    Object.prototype.hasOwnProperty.call(result, 'client')
                ).toBe(false);
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
            res: {
                value: 'b137f5dc               unauthorized usb:337641472X transport_id:1'
            }
        });

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
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
                expect(result === tracker.Devices[0]).toBe(true);
                expect(result).toEqual(
                    new Device(adb, {
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
            res: {
                value: 'b137f5dc               unauthorized usb:337641472X transport_id1'
            }
        });

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
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
            res: {
                value: 'b137f5dc               unauthorized usb:337641472X transport_id1'
            }
        });

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            const result = await promisify((cb) => {
                tracker.on('error', () => {});
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
            cmd: 'host:track-devices-l'
        });

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            const result = await promisify((cb) => {
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

    it('Should emit end when connection ends', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:track-devices-l'
        });

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            const result = await promisify<void>(async (cb) => {
                tracker.on('error', () => undefined);
                tracker.once('end', () => {
                    cb(null);
                });
                tracker['command'].endConnection();
            })();

            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should emit error when connection has error', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:track-devices-l'
        });

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            const result = await promisify<void>(async (cb) => {
                tracker.once('error', () => {
                    cb(null);
                });

                tracker['command'].connection.destroy(new Error('end'));
            })();

            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const adbMock = new AdbMock({
            res: 'fail'
        });

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.trackDevices()).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });
});
