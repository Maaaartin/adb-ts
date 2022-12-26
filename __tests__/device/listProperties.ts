import AdbClient from '../../lib/client';
import AdbDevice from '../../lib/device';
import { PropertyValue } from '../../lib/util/types';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('List properties tests', () => {
    it('Should list properties', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'shell:getprop',
                res: `[one]: [1]
[two]: [two]
[three]: [false]
[four]: [true]
[five]: [null]
[six]: []
[seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await new AdbDevice(adb, {
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
                    ['five', null],
                    ['six', undefined],
                    [
                        'seven',
                        new Date(
                            'Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)'
                        )
                    ]
                ])
            );
        } finally {
            await adbMock.end();
        }
    });
});
