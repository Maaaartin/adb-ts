import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Device drag and drop tests', () => {
    it('Should drag and drop device', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:input touchscreen draganddrop 100 200 100 10`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).dragAndDrop(100, 200, 100, 10);
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should drag and drop device with options', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:input gamepad draganddrop 100 200 100 10`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).dragAndDrop(
                100,
                200,
                100,
                10,
                {
                    source: 'gamepad'
                }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
