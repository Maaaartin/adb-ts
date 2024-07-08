import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Start activity tests', () => {
    it('Should start activity without options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:am start -n 'com.my.app/.Activity' --user 0`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).startActivity(
                'com.my.app',
                'Activity'
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should start activity with options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:am start -D -W -n 'com.my.app/.Activity' --user 0`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).startActivity(
                'com.my.app',
                'Activity',
                { debug: true, wait: true }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
