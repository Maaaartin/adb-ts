import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('List forwards tests', () => {
    it('Should list forwards', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host-serial:serial:list-forward',
                res: {
                    value: `serial tcp:9222 localabstract:chrome_devtools_remote
serial tcp:9223 localabstract:chrome_devtools_remote`
                }
            }
        ]);

        try {
            const port = await adbMock.start();
            const result = await getDevice(port).listForwards();
            expect(result).toEqual([
                {
                    local: 'tcp:9222',
                    remote: 'localabstract:chrome_devtools_remote',
                    serial: 'serial'
                },
                {
                    local: 'tcp:9223',
                    remote: 'localabstract:chrome_devtools_remote',
                    serial: 'serial'
                }
            ]);
        } finally {
            await adbMock.end();
        }
    });
});
