import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Device put setting tests', () => {
    it('Should put setting', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings put system 'setting' ''`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).putSetting(
                'system',
                'setting',
                ''
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
