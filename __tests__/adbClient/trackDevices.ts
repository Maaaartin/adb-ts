import { promisify } from 'bluebird';
import AdbClient from '../../lib/client';
import AdbDevice from '../../lib/device';
import { mockServer } from '../../mockery/mockAdbServer';

describe('Track devices', () => {
    it('Add', async () => {
        const { port, done, write } = await mockServer({
            expValue: 'host:track-devices-l'
        });

        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            const result = await promisify((cb) => {
                tracker.on('add', (d) => {
                    cb(null, d);
                });
                tracker.on('error', (err) => {
                    cb(err);
                });
                write(
                    'b137f5dc               unauthorized usb:337641472X transport_id:1'
                );
            })();
            try {
                expect(result).toBeInstanceOf(AdbDevice);
            } finally {
                await tracker.end();
            }
        } finally {
            await done();
        }
    });

    it('Remove', async () => {
        const { port, done, write } = await mockServer({
            expValue: 'host:track-devices-l',
            res: 'b137f5dc               unauthorized usb:337641472X transport_id:1'
        });

        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            const tracker = await adb.trackDevices();
            const result = await promisify((cb) => {
                tracker.on('remove', (d) => {
                    cb(null, d);
                });
                tracker.on('error', (err) => {
                    cb(err);
                });

                write('');
            })();
            try {
                expect(result).toBeInstanceOf(Object);
            } finally {
                await tracker.end();
            }
        } finally {
            await done();
        }
    });
});
