import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Set prop tests', () => {
    it('Should set prop', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:setprop 'prop' ''`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).setProp('prop', '');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
