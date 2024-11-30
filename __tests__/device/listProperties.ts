import { Client } from '../../lib/client';
import { Device } from '../../lib/device';
import { PropertyValue } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('List properties tests', () => {
    it('Should list properties', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'shell:getprop',
                res: {
                    value: `[one]: [int]
[two]: [string]
[three]: [bool]
[four]: [bool]
[five]: [string]
[six]: [string]
[one]: [1]
[two]: [two]
[three]: [false]
[four]: [true]
[five]: [null]
[six]: []
`,
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
            }).listProperties();
            expect(result).toEqual(
                new Map<string, PropertyValue>([
                    ['one', 1],
                    ['two', 'two'],
                    ['three', false],
                    ['four', true],
                    ['five', 'null'],
                    ['six', '']
                ])
            );
        } finally {
            await adbMock.end();
        }
    });
});
