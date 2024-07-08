import { AdbMock } from '../../mockery/mockAdbServer';
import { getClientAndDevice } from '../../mockery/testDevice';
import { Client } from '../../lib';

describe('Device usb tests', () => {
    it('Should restart usb connection', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `usb:`,
                res: { value: 'restarting in', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const { device, client } = getClientAndDevice(port);
            jest.spyOn(
                client,
                'awaitActiveDevice' as keyof Client
            ).mockImplementation(() => Promise.resolve());
            const result = await device.usb();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
