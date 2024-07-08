import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Wait boot complete tests', () => {
    it('Should wait for boot complete', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'shell:while getprop sys.boot_completed 2>/dev/null; do sleep 1; done',
                res: '2\n1\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).waitBootComplete();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
