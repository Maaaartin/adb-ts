import { getDevice } from '../../mockery/testDevice';
import { PropertyValue } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('List settings tests', () => {
    it('Should list settings', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'shell:settings list system',
                res: {
                    value: `one=1
two="two"
three=false
four=true
five=null
six=`,
                    raw: true
                }
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
                    ['six', undefined]
                ])
            );
        } finally {
            await adbMock.end();
        }
    });
});
