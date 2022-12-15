import AdbClient from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('File stat tests', () => {
    it('Should execute successfully', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:stat -c "%a\\_%A\\_%b\\_%B\\_%C\\_%d\\_%D\\_%f\\_%F\\_%g\\_%G\\_%h\\_%i\\_%m\\_%n\\_%N\\_%o\\_%s\\_%t\\_%T\\_%u\\_%U\\_%x\\_%X\\_%y\\_%Y\\_%z\\_%Z" /file`,
                res: '660\\_-rw-rw----\\_8\\_512\\_u:object_r:fuse:s0\\_80\\_50\\_81b0\\_regular empty file\\_1023\\_media_rw\\_1\\_303154\\_/storage/emulated\\_/sdcard/file\\_/sdcard/file\\_4096\\_0\\_0\\_0\\_10145\\_u0_a145\\_2022-12-15 16:40:46.871000000 +0100\\_1671118846\\_2022-12-15 16:40:46.871000000 +0100\\_1671118846\\_2022-12-15 21:33:17.585000000 +0100\\_1671136397',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            await adb.fileStat('serial', '/file');
            expect(undefined).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
