import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Reverse tests', () => {
    it('Should reverse ports', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'reverse:forward:localabstract:chrome_devtools_remote;tcp:9222',
                res: 'OKAY',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).reverse(
                'localabstract:chrome_devtools_remote',
                'tcp:9222'
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
