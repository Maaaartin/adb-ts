import { Client } from '../../lib/client';
import { Device } from '../../lib/device';
import { PropertyValue } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('List features tests', () => {
    it('Should list features', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'shell:pm list features 2>/dev/null',
                res: {
                    value: `feature:one=1
feature:two=two
feature:three=false
feature:four=true
feature:five=null
feature:six=`,
                    raw: true
                }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await new Device(adb, {
                id: 'serial',
                state: 'device',
                path: 'path',
                device: 'device',
                model: 'model',
                product: 'product',
                transportId: 'transportId',
                transport: 'usb'
            }).listFeatures();
            expect(result).toEqual(
                new Map<string, PropertyValue>([
                    ['one', 1],
                    ['two', 'two'],
                    ['three', false],
                    ['four', true],
                    ['five', null],
                    ['six', undefined]
                ])
            );
        } finally {
            await adbMock.end();
        }
    });
});
