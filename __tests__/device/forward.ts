import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Forward tests', () => {
    it('Should forward ports', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host-serial:serial:forward:tcp:9222;localabstract:chrome_devtools_remote',
                res: { value: 'OKAY', raw: true }
            }
        ]);

        try {
            const port = await adbMock.start();
            const result = await getDevice(port).forward(
                'tcp:9222',
                'localabstract:chrome_devtools_remote'
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
