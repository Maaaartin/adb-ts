import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Get serial no', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'shell:getprop ro.serialno',
                res: { value: 'test', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const serialNo = await adb.getSerialNo('serial');
            expect(serialNo).toBe('test');
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            { res: 'fail' },
            {
                cmd: 'shell:getprop ro.serialno',
                res: { value: 'test', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(adb.getSerialNo('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            { res: 'fail' }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(adb.getSerialNo('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected first response', async () => {
        const adbMock = new AdbMock([
            { res: 'unexpected' },
            {
                cmd: 'shell:getprop ro.serialno',
                res: { value: 'test', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(adb.getSerialNo('serial')).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            { res: 'unexpected' }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(adb.getSerialNo('serial')).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
