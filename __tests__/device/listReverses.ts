import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('List reverses tests', () => {
    it('Should list reverses', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'reverse:list-forward',
                res: {
                    value: `host-19 localabstract:chrome_devtools_remote tcp:9222
host-19 localabstract:chrome_devtools_remote tcp:9223`
                }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).listReverses();
            expect(result).toEqual([
                {
                    host: 'host-19',
                    local: 'tcp:9222',
                    remote: 'localabstract:chrome_devtools_remote'
                },
                {
                    host: 'host-19',
                    local: 'tcp:9223',
                    remote: 'localabstract:chrome_devtools_remote'
                }
            ]);
        } finally {
            await adbMock.end();
        }
    });
});
