import { AdbMockMulti } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';
import { Monkey } from '../../lib/monkey/client';

describe('Open Monkey tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
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
            { cmd: 'fail', res: null, rawRes: true },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);

        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        try {
            await expect(() => adb.openMonkey('serial')).rejects.toThrowError(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'fail', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);
        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        try {
            await expect(() => adb.openMonkey('serial')).rejects.toThrowError(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL third response', async () => {
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `fail`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);
        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        try {
            await expect(() => adb.openMonkey('serial')).rejects.toThrowError(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL fourth response', async () => {
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'fail', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);

        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        try {
            await expect(() => adb.openMonkey('serial')).rejects.toThrowError(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL fifth response', async () => {
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'fail', res: null, rawRes: true }
        ]);

        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        try {
            await expect(() => adb.openMonkey('serial')).rejects.toThrowError(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected first response', async () => {
        const adbMock = new AdbMockMulti([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true,
                unexpected: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.openMonkey('serial')).rejects.toThrowError(
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
                res: null,
                rawRes: true
            },
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true,
                unexpected: true
            },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.openMonkey('serial')).rejects.toThrowError(
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
                res: null,
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true,
                unexpected: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.openMonkey('serial')).rejects.toThrowError(
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
                res: null,
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            ...Array(40).fill({
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true,
                unexpected: true
            }),
            { cmd: 'tcp:1080', res: null, rawRes: true }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.openMonkey('serial')).rejects.toThrowError(
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
                res: null,
                rawRes: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port 1080 -v`,
                res: ':Monkey:\n',
                rawRes: true
            },
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            ...Array(40).fill({
                cmd: 'tcp:1080',
                res: null,
                rawRes: true,
                unexpected: true
            })
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.openMonkey('serial')).rejects.toThrowError(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
