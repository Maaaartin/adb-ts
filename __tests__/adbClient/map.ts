import { Client } from '../../lib/client';
import { IDevice } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';
import { Device } from '../../lib/device';
import { UnexpectedDataError } from '../../lib/util';

describe('Map tests', () => {
    it('Should map over devices', async () => {
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
            const devices = await adb.map((d) => d);
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
            devices.forEach((d, i) => {
                expect(d).toEqual(new Device(adb, expected[i]));
            });
        } finally {
            await adbMock.end();
        }
    });

    it('Should throw error when devices cannot be parsed', async () => {
        const raw =
            'b137f5dc               device usb:337641472X product:FP4eea model:FP4 device:FP4 transport_id:1'
                .concat('\n')
                .concat(
                    'b137f5dd               device usb337641472Y product:FP4eeb model:FP3 device:FP3 transport_id:2'
                );

        const adbMock = new AdbMock([
            { cmd: 'host:devices-l', res: { value: raw } }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.map((d) => d);
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError(
                        'usb337641472Y, ',
                        'usb, product, model, device, transport_id'
                    )
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
