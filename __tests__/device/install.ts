import { Readable } from 'stream';
import { AdbMockMulti } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Install tests', () => {
    it('Should install apk without options', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'OKAY' + buff.toString(), raw: true },
                end: true
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:pm install "/data/local/tmp/_stream.apk"`,
                res: { value: 'Success\n', raw: true },
                end: true
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: { value: '123', raw: true },
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).install(
                Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
            );
            expect(result).toBeUndefined();
        } finally {
            adbMock.end();
        }
    });

    it('Should fail installation when getting Failure response', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'OKAY' + buff.toString(), raw: true },
                end: true
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:pm install "/data/local/tmp/_stream.apk"`,
                res: { value: 'Failure [6]\n', raw: true },
                end: true
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: { value: '123', raw: true },
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            try {
                await getDevice(port).install(
                    Readable.from(Buffer.from([1, 0, 0, 0, 0, 0, 0]))
                );
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

    it('Should install apk with options', async () => {
        const buff = Buffer.from([4, 0, 0, 0]);
        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'sync:',
                res: { value: 'OKAY' + buff.toString(), raw: true },
                end: true
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:pm install -r -t -f -d -g "/data/local/tmp/_stream.apk" args`,
                res: { value: 'Success\n', raw: true },
                end: true
            },
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:rm -f '/data/local/tmp/_stream.apk'`,
                res: { value: '123', raw: true },
                end: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).install(
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
