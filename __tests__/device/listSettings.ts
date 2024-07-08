import { getDevice } from '../../mockery/testDevice';
import { PropertyValue } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('List settings tests', () => {
    it('Should list settings', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'shell:settings list system',
                res: `one=1
two="two"
three=false
four=true
five=null
six=
seven=Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).listSettings('system');
            expect(result).toEqual(
                new Map<string, PropertyValue>([
                    ['one', 1],
                    ['two', '"two"'],
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
