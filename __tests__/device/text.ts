import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Device text tests', () => {
    it('Should text input', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:input touchscreen text 'something'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).text('something');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should text input with source parameter', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:input gamepad text 'something'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).text('something', 'gamepad');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
