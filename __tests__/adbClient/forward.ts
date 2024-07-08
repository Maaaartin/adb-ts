import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';

describe('Forward tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host-serial:serial:forward:tcp:9222;localabstract:chrome_devtools_remote',
                res: { value: 'OKAY', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.forward(
                'serial',
                'tcp:9222',
                'localabstract:chrome_devtools_remote'
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const adbMock = new AdbMock([
            {
                res: 'fail'
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(
                adb.forward(
                    'serial',
                    'tcp:9222',
                    'localabstract:chrome_devtools_remote'
                )
            ).rejects.toEqual(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected', async () => {
        const adbMock = new AdbMock([
            {
                res: 'unexpected'
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(
                adb.forward(
                    'serial',
                    'tcp:9222',
                    'localabstract:chrome_devtools_remote'
                )
            ).rejects.toEqual(new UnexpectedDataError('UNEX', 'OKAY or FAIL'));
        } finally {
            await adbMock.end();
        }
    });
});
