import T from 'timers/promises';
import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';

describe('Tcpip', () => {
    it('OKAY with default port', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `tcpip:5555`,
                res: 'restarting in',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            jest.spyOn(adb as any, 'awaitActiveDevice').mockImplementation(() =>
                Promise.resolve()
            );
            const result = await adb.tcpip('serial');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with passed port', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `tcpip:3333`,
                res: 'restarting in',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            jest.spyOn(adb as any, 'awaitActiveDevice').mockImplementation(() =>
                Promise.resolve()
            );
            const result = await adb.tcpip('serial', 3333);
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should fail when awaiter rejects', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `tcpip:5555`,
                res: 'restarting in',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            jest.spyOn(adb as any, 'awaitActiveDevice').mockImplementation(() =>
                T.setTimeout(1000).then(() => {
                    throw new Error('message');
                })
            );
            await expect(adb.tcpip('serial')).rejects.toEqual(
                new Error('message')
            );
        } finally {
            await adbMock.end();
        }
    });
});
