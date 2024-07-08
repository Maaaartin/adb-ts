import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Start service tests', () => {
    it('Should start service without options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:am startservice -n 'com.my.app/.Service' --user 0`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).startService(
                'com.my.app',
                'Service'
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should start service with primitive type options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:am startservice -a 'action' -d 'data' -t 'mimeType' -f 1 -n 'com.my.app/.Service' --user 1`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).startService(
                'com.my.app',
                'Service',
                {
                    user: 1,
                    action: 'action',
                    data: 'data',
                    mimeType: 'mimeType',
                    flags: 1
                }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should start service with extras options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:am startservice -a 'action' -d 'data' -t 'mimeType' -f 1 -n 'com.my.app/.Service' --user 1`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).startService(
                'com.my.app',
                'Service',
                {
                    user: 1,
                    action: 'action',
                    data: 'data',
                    mimeType: 'mimeType',
                    flags: 1
                }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
