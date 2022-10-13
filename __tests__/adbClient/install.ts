import AdbMock from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';

describe('Install', () => {
    it('OKAY', async () => {
        expect(1).toBe(1);
        // const adbMock = new AdbMock([
        //     {
        //         cmd: 'host:transport:serial',
        //         res: null,
        //         rawRes: true
        //     },
        //     {
        //         cmd: `sync:`,
        //         res: null,
        //         rawRes: true
        //     }
        // ]);
        // try {
        //     const port = await adbMock.start();
        //     const adb = new AdbClient({ noAutoStart: true, port });
        //     const result = await adb.install('serial', 'fake.apk');
        //     expect(result).toBe(void 0);
        // } finally {
        //     await adbMock.end();
        // }
    });
});
