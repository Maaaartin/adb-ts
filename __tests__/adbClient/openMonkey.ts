import AdbMock from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { UnexpectedDataError } from '../../lib';
import Monkey from '../../lib/monkey/client';

describe('Open Monkey tests', () => {
    test('OKAY', async () => {
        // const adbMock = new AdbMock([
        //     { cmd: 'host:transport:serial', res: null, rawRes: true },
        //     { cmd: 'host:transport:serial', res: null, rawRes: true },
        //     {
        //         cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port ${1080} -v`,
        //         res: ':Monkey:\n',
        //         rawRes: true
        //     },
        //     { cmd: 'tcp:1080', res: null, rawRes: true }
        // ]);
        // try {
        //     const port = await adbMock.start();
        //     const adb = new AdbClient({ noAutoStart: true, port });
        //     const res = await adb.openMonkey('serial');
        //     expect(res).toBeInstanceOf(Monkey);
        //     res.end();
        // } finally {
        //     await adbMock.end();
        // }
    });
});
