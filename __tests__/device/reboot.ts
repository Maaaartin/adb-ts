import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Reboot tests', () => {
    it('Should reboot device', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'reboot:', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).reboot();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
