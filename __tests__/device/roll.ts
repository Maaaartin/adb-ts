import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Device roll tests', () => {
    it('Should roll screen', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:input trackball roll 100 0`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).roll(100, 0);
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should roll screen with source parameter', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:input gamepad roll 100 0`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).roll(100, 0, 'gamepad');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
