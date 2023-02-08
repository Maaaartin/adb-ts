import { Monkey } from '../../lib/monkey/client';
import { AdbMockMulti } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Device open monkey tests', () => {
    it('Should open monkey', async () => {
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).openMonkey();
            expect(result).toBeInstanceOf(Monkey);
            result.end();
        } finally {
            await adbMock.end();
        }
    });
});
