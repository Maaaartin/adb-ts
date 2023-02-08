import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Device press tests', () => {
    it('Should press on device', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:input trackball press`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).press();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should press on device with source parameter', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:input gamepad press`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).press('gamepad');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
