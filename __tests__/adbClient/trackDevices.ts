import { promisify } from 'bluebird';
import AdbClient from '../../lib/client';
// TODO fix errors and revert
// import AdbDevice from '../../lib/device';
import AdbMock from '../../mockery/mockAdbServer';

describe('Track devices', () => {
    // it('Add', async () => {
    //     const adbMock = new AdbMock({
    //         cmd: 'host:track-devices-l',
    //         res: null
    //     });

    //     try {
    //         const port = await adbMock.start();
    //         const adb = new AdbClient({ noAutoStart: true, port });
    //         const tracker = await adb.trackDevices();
    //         const result = await promisify((cb) => {
    //             tracker.on('add', (d) => {
    //                 cb(null, d);
    //             });
    //             tracker.on('error', (err) => {
    //                 cb(err);
    //             });
    //             adbMock.forceWrite(
    //                 'b137f5dc               unauthorized usb:337641472X transport_id:1'
    //             );
    //         })();
    //         try {
    //             expect(result).toBeInstanceOf(AdbDevice);
    //         } finally {
    //             await tracker.end();
    //         }
    //     } finally {
    //         await adbMock.end();
    //     }
    // });

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
                    cb(err);
                });

                adbMock.forceWrite('');
            })();
            try {
                expect(result).toBeInstanceOf(Object);
            } finally {
                await tracker.end();
            }
        } finally {
            await adbMock.end();
        }
    });

    // it('Change', async () => {
    //     const adbMock = new AdbMock({
    //         cmd: 'host:track-devices-l',
    //         res: 'b137f5dc               unauthorized usb:337641472X transport_id:1'
    //     });

    //     try {
    //         const port = await adbMock.start();
    //         const adb = new AdbClient({ noAutoStart: true, port });
    //         const tracker = await adb.trackDevices();
    //         const result = await promisify((cb) => {
    //             tracker.on('change', (d) => {
    //                 cb(null, d);
    //             });
    //             tracker.on('error', (err) => {
    //                 cb(err);
    //             });

    //             adbMock.forceWriteData(
    //                 'b137f5dc               device usb:337641472X transport_id:1'
    //             );
    //         })();
    //         try {
    //             expect(result).toBeInstanceOf(AdbDevice);
    //         } finally {
    //             await tracker.end();
    //         }
    //     } finally {
    //         await adbMock.end();
    //     }
    // });

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
                await tracker.end();
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
                    cb(null);
                });
            })();
            try {
                expect(result).toBe(undefined);
            } finally {
                await tracker.end();
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
                    cb(null);
                });
                await tracker.end();
            })();
            try {
                expect(result).toBe(undefined);
            } finally {
                await tracker.end();
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
            } catch (e) {
                expect(e.message).toBe('Failure');
            }
        } finally {
            await adbMock.end();
        }
    });
});
