import crypto from 'crypto';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return '1-2-3-4-5';
    });
});

describe('Device cp tests', () => {
    it('Should run cp command without options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(cp /file /other) || echo '1-2-3-4-5'`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).cp('/file', '/other');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should run cp command with options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:(cp -F -H -L -P -d -f -l -n -p -r -s -t -u /file /other) || echo '1-2-3-4-5'`,
                res: 'data',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).cp('/file', '/other', {
                noClobber: true,
                symlink: true,
                recursive: true,
                hardLink: true,
                noDereference: true,
                noFollowSymlinks: true,
                followAllSymlinks: true,
                followListedSymlinks: true,
                delFirst: true,
                delDest: true,
                update: true,
                preserveTimestamps: true,
                copyToTarget: true
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
