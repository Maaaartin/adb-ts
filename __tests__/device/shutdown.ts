import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Shutdown tests', () => {
    it('Should shutdown device', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'shell:reboot -p', res: { raw: true } }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).shutdown();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
