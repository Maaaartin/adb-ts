import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Device swipe tests', () => {
    it('Should swipe device', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:input touchscreen swipe 100 200 100 10`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).swipe(100, 200, 100, 10);
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should swipe device with options', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:input gamepad swipe 100 200 100 10`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).swipe(100, 200, 100, 10, {
                source: 'gamepad'
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
