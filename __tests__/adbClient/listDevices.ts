import { IAdbDevice, UnexpectedDataError } from '../../lib';
import AdbClient from '../../lib/client';
import { mockServer } from '../../mockery/mockAdbServer';

// TODO test emulator and offline
describe('List devices', () => {
    it('FAIL', async () => {
        const { port, done } = await mockServer({
            expValue: 'fail'
        });

        const adb = new AdbClient({ port, noAutoStart: true });
        try {
            await adb.listDevices();
        } catch (e) {
            expect(e.message).toBe('Failure');
        } finally {
            await done();
        }
    });

    it('Unexpected', async () => {
        const { port, done } = await mockServer({
            expValue: 'fail',
            unexpected: true
        });

        const adb = new AdbClient({ port, noAutoStart: true });
        try {
            await adb.listDevices();
        } catch (e) {
            expect(e).toBeInstanceOf(UnexpectedDataError);
        } finally {
            await done();
        }
    });

    it('Unauthorized', async () => {
        const raw =
            'b137f5dc               unauthorized usb:337641472X transport_id:1';
        const { port, done } = await mockServer({
            expValue: 'host:devices-l',
            res: raw
        });
        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            const devices = await adb.listDevices();
            const expected: IAdbDevice[] = [
                {
                    id: 'b137f5dc',
                    path: '337641472X',
                    state: 'unauthorized',
                    transport: 'usb',
                    transportId: '1'
                }
            ];
            expect(devices).toEqual(expected);
        } finally {
            await done();
        }
    });

    it('Device', async () => {
        const raw =
            'b137f5dc               device usb:337641472X product:FP4eea model:FP4 device:FP4 transport_id:1'
                .concat('\n')
                .concat(
                    'b137f5dd               device usb:337641472Y product:FP4eeb model:FP3 device:FP3 transport_id:2'
                );
        const { port, done } = await mockServer({
            expValue: 'host:devices-l',
            res: raw
        });
        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            const devices = await adb.listDevices();
            const expected: IAdbDevice[] = [
                {
                    device: 'FP4',
                    id: 'b137f5dc',
                    model: 'FP4',
                    path: '337641472X',
                    product: 'FP4eea',
                    state: 'device',
                    transport: 'usb',
                    transportId: '1'
                },
                {
                    device: 'FP3',
                    id: 'b137f5dd',
                    model: 'FP3',
                    path: '337641472Y',
                    product: 'FP4eeb',
                    state: 'device',
                    transport: 'usb',
                    transportId: '2'
                }
            ];
            expect(devices).toEqual(expected);
        } finally {
            await done();
        }
    });

    it('Throw error when id or state is invalid', async () => {
        const raw = 'test ';
        const { port, done } = await mockServer({
            expValue: 'host:devices-l',
            res: raw
        });
        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.listDevices();
        } catch (e) {
            expect(e).toBeInstanceOf(UnexpectedDataError);
        } finally {
            await done();
        }
    });

    it('Throw error when properties are invalid', async () => {
        const raw =
            'b137f5dc               unauthorized usb337641472X transport_id:1';
        const { port, done } = await mockServer({
            expValue: 'host:devices-l',
            res: raw
        });
        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.listDevices();
        } catch (e) {
            expect(e).toBeInstanceOf(UnexpectedDataError);
        } finally {
            await done();
        }
    });

    it('No devices', async () => {
        const raw = '';
        const { port, done } = await mockServer({
            expValue: 'host:devices-l',
            res: raw
        });
        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            const devices = await adb.listDevices();
            expect(devices).toEqual([]);
        } finally {
            await done();
        }
    });
});
