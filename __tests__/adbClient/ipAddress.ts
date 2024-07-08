import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';

describe('IP address', () => {
    it('Single address', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: "shell:ip route | awk '{ print $9 }'",
                res: { value: '127.0.0.1', raw: true }
            }
        ]);

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.getIpAddress('serial');
            expect(result).toEqual(['127.0.0.1']);
        } finally {
            await adbMock.end();
        }
    });

    it('Multiple addresses', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: "shell:ip route | awk '{ print $9 }'",
                res: { value: '127.0.0.1\n127.0.0.2', raw: true }
            }
        ]);

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.getIpAddress('serial');
            expect(result).toEqual(['127.0.0.1', '127.0.0.2']);
        } finally {
            await adbMock.end();
        }
    });

    it('No address', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: "shell:ip route | awk '{ print $9 }'",
                res: { raw: true }
            }
        ]);

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.getIpAddress('serial');
            expect(result).toHaveLength(0);
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            { res: 'fail' },
            {
                cmd: "shell:ip route | awk '{ print $9 }'",
                res: { value: '127.0.0.1', raw: true }
            }
        ]);

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.getIpAddress('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                res: 'fail'
            }
        ]);

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.getIpAddress('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });
});
