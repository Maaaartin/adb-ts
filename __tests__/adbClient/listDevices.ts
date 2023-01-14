import { IAdbDevice } from '../../lib/util';
import { UnexpectedDataError } from '../../lib/util';
import { AdbClient } from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('List devices', () => {
    it('FAIL', async () => {
        const adbMock = new AdbMock([{ cmd: 'fail', res: null }]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ port, noAutoStart: true });
            try {
                await adb.listDevices();
                fail('Expected Failure');
            } catch (e: any) {
                expect(e.message).toBe('Failure');
            }
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: null, unexpected: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ port, noAutoStart: true });
            await adb.listDevices();
            fail('Expected Failure');
        } catch (e: any) {
            expect(e).toBeInstanceOf(UnexpectedDataError);
        } finally {
            await adbMock.end();
        }
    });

    it('Unauthorized', async () => {
        const mock = new AdbMock([
            {
                cmd: 'host:devices-l',
                res: 'b137f5dc               unauthorized usb:337641472X transport_id:1'
            }
        ]);

        try {
            const port = await mock.start();
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
            await mock.end();
        }
    });

    it('Device', async () => {
        const raw =
            'b137f5dc               device usb:337641472X product:FP4eea model:FP4 device:FP4 transport_id:1'
                .concat('\n')
                .concat(
                    'b137f5dd               device usb:337641472Y product:FP4eeb model:FP3 device:FP3 transport_id:2'
                );

        const adbMock = new AdbMock([{ cmd: 'host:devices-l', res: raw }]);
        try {
            const port = await adbMock.start();
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
            await adbMock.end();
        }
    });

    it('Throw error when id or state is invalid', async () => {
        const adbMock = new AdbMock([{ cmd: 'host:devices-l', res: 'test' }]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.listDevices();
        } catch (e: any) {
            expect(e).toBeInstanceOf(UnexpectedDataError);
        } finally {
            await adbMock.end();
        }
    });

    it('Throw error when properties are invalid', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:devices-l',
            res: 'b137f5dc               unauthorized usb337641472X transport_id:1'
        });
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.listDevices();
        } catch (e: any) {
            expect(e).toBeInstanceOf(UnexpectedDataError);
        } finally {
            await adbMock.end();
        }
    });

    it('No devices', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:devices-l',
            res: ''
        });
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const devices = await adb.listDevices();
            expect(devices).toEqual([]);
        } finally {
            await adbMock.end();
        }
    });
});
