import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Get prop tests', () => {
    it('Should get prop', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'shell:getprop prop',
                res: `string\n`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).getProp('prop');
            expect(result).toBe('string');
        } finally {
            await adbMock.end();
        }
    });
});
