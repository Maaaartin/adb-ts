import T from 'timers/promises';
import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';

describe('Usb', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `usb:`,
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
            const result = await adb.usb('serial');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should fail when awaiter rejects', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `usb:`,
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

            await expect(() => adb.usb('serial')).rejects.toThrowError(
                'message'
            );
        } finally {
            await adbMock.end();
        }
    });
});
