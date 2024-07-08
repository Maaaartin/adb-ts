import T from 'timers/promises';
import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';

describe('Usb', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `usb:`,
                res: { value: 'restarting in', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            jest.spyOn(
                adb,
                'awaitActiveDevice' as keyof Client
            ).mockImplementation(() => Promise.resolve());
            const result = await adb.usb('serial');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should fail when awaiter rejects', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `usb:`,
                res: { value: 'restarting in', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            jest.spyOn(
                adb,
                'awaitActiveDevice' as keyof Client
            ).mockImplementation(() =>
                T.setTimeout(1000).then(() => {
                    throw new Error('message');
                })
            );

            await expect(adb.usb('serial')).rejects.toEqual(
                new Error('message')
            );
        } finally {
            await adbMock.end();
        }
    });
});
