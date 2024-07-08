import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Remount tests', () => {
    it('Should remount device', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'remount:', res: '', rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).remount();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
