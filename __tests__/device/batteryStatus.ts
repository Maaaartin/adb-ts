import { AdbMock } from '../../mockery/mockAdbServer';
import { PrimitiveType } from '../../lib/util';
import { getDevice } from '../../mockery/testDevice';

describe('Device battery status tests', () => {
    it('Should parse battery status', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'shell:dumpsys battery',
                res: `Current Battery Service state:
            AC powered: false
            USB powered: false
            Wireless powered: false
            Max charging current: 0
            Max charging voltage: 0
            Charge counter: 10000
            status: 4
            health: 2
            present: true
            level: 100
            scale: 100
            voltage: 5000
            temperature: 250
            technology: Li-ion`
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).batteryStatus();
            expect(result).toEqual(
                new Map<string, PrimitiveType>([
                    ['AC powered', false],
                    ['USB powered', false],
                    ['Wireless powered', false],
                    ['Max charging current', 0],
                    ['Max charging voltage', 0],
                    ['Charge counter', 10000],
                    ['status', 4],
                    ['health', 2],
                    ['present', true],
                    ['level', 100],
                    ['scale', 100],
                    ['voltage', 5000],
                    ['temperature', 250],
                    ['technology', 'Li-ion']
                ])
            );
        } finally {
            await adbMock.end();
        }
    });
});
