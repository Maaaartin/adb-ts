import { AdbMock } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { UnexpectedDataError } from '../../lib';

describe('Forward tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host-serial:serial:forward:tcp:9222;localabstract:chrome_devtools_remote',
                res: 'OKAY',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.forward(
                'serial',
                'tcp:9222',
                'localabstract:chrome_devtools_remote'
            );
            expect(result).toBe(undefined);
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'fail',
                res: 'OKAY',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.forward(
                    'serial',
                    'tcp:9222',
                    'localabstract:chrome_devtools_remote'
                );
                fail('Expected Failure');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host-serial:serial:forward:tcp:9222;localabstract:chrome_devtools_remote',
                res: 'OKAY',
                rawRes: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.forward(
                    'serial',
                    'tcp:9222',
                    'localabstract:chrome_devtools_remote'
                );
                fail('Expected Failure');
            } catch (e) {
                expect(e).toBeInstanceOf(UnexpectedDataError);
                expect(e).toEqual(
                    new Error("Unexpected 'UNEX', was expecting OKAY or FAIL")
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
