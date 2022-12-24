import { AdbMock, AdbMockMulti } from '../../mockery/mockAdbServer';
import AdbClient from '../../src/client';
import { promisify } from 'util';
import { FailError, UnexpectedDataError } from '../../src/util/errors';
import { Readable } from 'stream';

describe('Install OKAY tests', () => {
    it('Should install with Success response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'OKAY' + buff.toString(),
                rawRes: true,
                end: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:pm install "/data/local/tmp/_stream.apk"`,
                res: 'Success\n',
                rawRes: true,
                end: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:'rm' '-f' '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });

            const result = await adb.install(
                'serial',
                Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
            );
            expect(result).toBeUndefined();
        } finally {
            adbMock.end();
        }
    });

    it('Should install with Failure response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'OKAY' + buff.toString(),
                rawRes: true,
                end: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:pm install "/data/local/tmp/_stream.apk"`,
                res: 'Failure [6]\n',
                rawRes: true,
                end: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:'rm' '-f' '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });

            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(
                    new Error(
                        '/data/local/tmp/_stream.apk could not be installed [6]'
                    )
                );
            }
        } finally {
            adbMock.end();
        }
    });

    it('Should install with options and Success response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'OKAY' + buff.toString(),
                rawRes: true,
                end: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:pm install -r -t -f -d -g "/data/local/tmp/_stream.apk" args`,
                res: 'Success\n',
                rawRes: true,
                end: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:'rm' '-f' '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });

            const result = await adb.install(
                'serial',
                Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0])),
                {
                    reinstall: true,
                    test: true,
                    internal: true,
                    allowDowngrade: true,
                    grandPermissions: true
                },
                'args'
            );
            expect(result).toBeUndefined();
        } finally {
            adbMock.end();
        }
    });
});
