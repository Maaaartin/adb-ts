import { AdbMockMulti } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';
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
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });

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
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });

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
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });

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

describe('Install FAIL tests', () => {
    it('Should fail first response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            { cmd: 'fail', res: null, rawRes: true },
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
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            adbMock.end();
        }
    });
    it('Should fail second response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'fail',
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
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            adbMock.end();
        }
    });
    it('Should fail third response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'sync:',
                res: 'OKAY' + buff.toString(),
                rawRes: true,
                end: true
            },
            { cmd: 'fail', res: null, rawRes: true },
            {
                cmd: `shell:pm install "/data/local/tmp/_stream.apk"`,
                res: 'Success\n',
                rawRes: true,
                end: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            adbMock.end();
        }
    });

    it('Should fail fourth response', async () => {
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
                cmd: `fail`,
                res: 'Success\n',
                rawRes: true,
                end: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            adbMock.end();
        }
    });

    it('Should fail fifth response', async () => {
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
            { cmd: 'fail', res: null, rawRes: true },
            {
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            adbMock.end();
        }
    });

    it('Should fail sixth response', async () => {
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
                cmd: `fail`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            adbMock.end();
        }
    });
});

describe('Install unexpected test', () => {
    it('Should have unexpected error on first response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true,
                unexpected: true
            },
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
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            adbMock.end();
        }
    });

    it('Should have unexpected error on second response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: 'sync:',
                res: 'OKAY' + buff.toString(),
                rawRes: true,
                end: true,
                unexpected: true
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
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            adbMock.end();
        }
    });

    it('Should have unexpected error on third response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: 'sync:',
                res: 'OKAY' + buff.toString(),
                rawRes: true,
                end: true
            },
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true,
                unexpected: true
            },
            {
                cmd: `shell:pm install "/data/local/tmp/_stream.apk"`,
                res: 'Success\n',
                rawRes: true,
                end: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            adbMock.end();
        }
    });

    it('Should have unexpected error on fourth response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
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
                end: true,
                unexpected: true
            },
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            adbMock.end();
        }
    });

    it('Should have unexpected error on fifth response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
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
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true,
                unexpected: true
            },
            {
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            adbMock.end();
        }
    });

    it('Should have unexpected error on sixth response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
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
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: '123',
                rawRes: true,
                end: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            try {
                await adb.install(
                    'serial',
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
                fail('Expected error');
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            adbMock.end();
        }
    });
});
