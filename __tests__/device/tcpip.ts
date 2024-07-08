import { AdbMock } from '../../mockery/mockAdbServer';
import { getClientAndDevice } from '../../mockery/testDevice';
import { Client } from '../../lib';

describe('Device tcpip tests', () => {
    it('Should restart tcp connection', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `tcpip:5555`,
                res: 'restarting in',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const { device, client } = getClientAndDevice(port);
            jest.spyOn(
                client,
                'awaitActiveDevice' as keyof Client
            ).mockImplementation(() => Promise.resolve());
            const result = await device.tcpip();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should restart tcp connection with passed port', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `tcpip:3333`,
                res: 'restarting in',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const { device, client } = getClientAndDevice(port);
            jest.spyOn(
                client,
                'awaitActiveDevice' as keyof Client
            ).mockImplementation(() => Promise.resolve());
            const result = await device.tcpip(3333);
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
