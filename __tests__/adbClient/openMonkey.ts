import { AdbMockMulti } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';
import { Monkey } from '../../lib/monkey/client';

describe('Open Monkey tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: { value: ':Monkey:\n', raw: true }
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'tcp:1080', res: { raw: true } }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });

            const res = await adb.openMonkey('serial');
            expect(res).toBeInstanceOf(Monkey);
            res.end();
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMockMulti([
            { res: 'fail' },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: { value: ':Monkey:\n', raw: true }
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'tcp:1080', res: { raw: true } }
        ]);

        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        try {
            await expect(() => adb.openMonkey('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: { raw: true } },
            { res: 'fail' },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: { value: ':Monkey:\n', raw: true }
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'tcp:1080', res: { raw: true } }
        ]);
        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        try {
            await expect(() => adb.openMonkey('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL third response', async () => {
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'host:transport:serial', res: { raw: true } },
            { res: `fail` },
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'tcp:1080', res: { raw: true } }
        ]);
        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        try {
            await expect(() => adb.openMonkey('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL fourth response', async () => {
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: { value: ':Monkey:\n', raw: true }
            },
            { res: 'fail' },
            { cmd: 'tcp:1080', res: { raw: true } }
        ]);

        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        try {
            await expect(() => adb.openMonkey('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL fifth response', async () => {
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: { value: ':Monkey:\n', raw: true }
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            { res: 'fail' }
        ]);

        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        try {
            await expect(() => adb.openMonkey('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected first response', async () => {
        const adbMock = new AdbMockMulti([
            {
                res: 'unexpected'
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: { value: ':Monkey:\n', raw: true }
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'tcp:1080', res: { raw: true } }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.openMonkey('serial')).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected second response', async () => {
        const adbMock = new AdbMockMulti([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                res: 'unexpected'
            },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: { value: ':Monkey:\n', raw: true }
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'tcp:1080', res: { raw: true } }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.openMonkey('serial')).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected third response', async () => {
        const adbMock = new AdbMockMulti([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            { res: 'unexpected' },
            { cmd: 'host:transport:serial', res: { raw: true } },
            { cmd: 'tcp:1080', res: { raw: true } }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.openMonkey('serial')).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected fourth response', async () => {
        const adbMock = new AdbMockMulti([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: { value: ':Monkey:\n', raw: true }
            },
            ...Array(40).fill({
                res: 'unexpected'
            }),
            { cmd: 'tcp:1080', res: { raw: true } }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.openMonkey('serial')).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected fifth response', async () => {
        const adbMock = new AdbMockMulti([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: { value: ':Monkey:\n', raw: true }
            },
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            ...Array(40).fill({
                cmd: 'tcp:1080',
                res: 'unexpected'
            })
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.openMonkey('serial')).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
