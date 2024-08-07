import { IDevice } from '../../lib/util';
import { UnexpectedDataError } from '../../lib/util';
import { Client } from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('List devices', () => {
    it('FAIL', async () => {
        const adbMock = new AdbMock([{ res: 'fail' }]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ port, noAutoStart: true });
            await expect(() => adb.listDevices()).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected', async () => {
        const adbMock = new AdbMock([{ res: 'unexpected' }]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ port, noAutoStart: true });
            await expect(() => adb.listDevices()).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unauthorized', async () => {
        const mock = new AdbMock([
            {
                cmd: 'host:devices-l',
                res: {
                    value: 'b137f5dc               unauthorized usb:337641472X transport_id:1'
                }
            }
        ]);

        try {
            const port = await mock.start();
            const adb = new Client({ noAutoStart: true, port });
            const devices = await adb.listDevices();
            const expected: IDevice[] = [
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

        const adbMock = new AdbMock([
            { cmd: 'host:devices-l', res: { value: raw } }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const devices = await adb.listDevices();
            const expected: IDevice[] = [
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
        const adbMock = new AdbMock([
            { cmd: 'host:devices-l', res: { value: 'test' } }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await adb.listDevices();
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(UnexpectedDataError);
        } finally {
            await adbMock.end();
        }
    });

    it('Throw error when properties are invalid', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:devices-l',
            res: {
                value: 'b137f5dc               unauthorized usb337641472X transport_id:1'
            }
        });
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await adb.listDevices();
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(UnexpectedDataError);
        } finally {
            await adbMock.end();
        }
    });

    it('No devices', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:devices-l'
        });
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const devices = await adb.listDevices();
            expect(devices).toEqual([]);
        } finally {
            await adbMock.end();
        }
    });

    it('Should throw unexpected error for missing state or id', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:devices-l',
                res: { value: 'usb:337641472X' }
            }
        ]);

        try {
            const port = await adbMock.start();
            const adb = new Client({ port, noAutoStart: true });
            await expect(() => adb.listDevices()).rejects.toEqual(
                new UnexpectedDataError(
                    'usb:337641472X',
                    '<id> <state> <usb|product|model|device|transport_id>:<value>'
                )
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Should throw unexpected error for transport_id', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:devices-l',
                res: {
                    value: 'b137f5dc               unauthorized usb:337641472X'
                }
            }
        ]);

        try {
            const port = await adbMock.start();
            const adb = new Client({ port, noAutoStart: true });
            await expect(() => adb.listDevices()).rejects.toEqual(
                new UnexpectedDataError(
                    'b137f5dc               unauthorized usb:337641472X',
                    '<id> <state> <usb|product|model|device|transport_id>:<value>'
                )
            );
        } finally {
            await adbMock.end();
        }
    });
});
