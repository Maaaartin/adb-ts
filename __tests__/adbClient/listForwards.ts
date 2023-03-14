import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';

describe('Forward tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host-serial:serial:list-forward',
                res: `serial tcp:9222 localabstract:chrome_devtools_remote
serial tcp:9223 localabstract:chrome_devtools_remote`
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.listForwards('serial');
            expect(result).toEqual([
                {
                    local: 'tcp:9222',
                    remote: 'localabstract:chrome_devtools_remote',
                    serial: 'serial'
                },
                {
                    local: 'tcp:9223',
                    remote: 'localabstract:chrome_devtools_remote',
                    serial: 'serial'
                }
            ]);
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY empty value', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host-serial:serial:list-forward',
                res: ''
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.listForwards('serial');
            expect(result).toEqual([]);
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'fail',
                res: null
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.listForwards('serial')).rejects.toThrowError(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host-serial:serial:list-forward',
                res: null,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.listForwards('serial')).rejects.toThrowError(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
