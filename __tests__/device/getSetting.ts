import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Get setting tests', () => {
    it('Should setting prop', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:settings get system 'prop'`,
                res: { value: `string\n`, raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).getSetting('system', 'prop');
            expect(result).toBe('string');
        } finally {
            await adbMock.end();
        }
    });
});
