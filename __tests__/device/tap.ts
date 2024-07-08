import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Device tap tests', () => {
    it('Should tap screen', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:input touchscreen tap 100 0`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).tap(100, 0);
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should tap screen with source parameter', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:input gamepad tap 100 0`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).tap(100, 0, 'gamepad');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
