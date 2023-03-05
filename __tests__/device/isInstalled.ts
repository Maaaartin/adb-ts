import { UnexpectedDataError } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Is installed tests', () => {
    it('Should test that apk is installed', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm path com.package 2>/dev/null`,
                res: 'package:\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).isInstalled('com.package');
            expect(result).toBe(true);
        } finally {
            await adbMock.end();
        }
    });

    it('Should test that apk is not installed', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm path com.package 2>/dev/null`,
                res: 'fail:\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).isInstalled('com.package');
            expect(result).toBe(false);
        } finally {
            await adbMock.end();
        }
    });

    it('Should fail after getting wrong response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm path com.package 2>/dev/null`,
                res: 'badValue\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            await expect(() =>
                getDevice(port).isInstalled('com.package')
            ).rejects.toThrowError(
                new UnexpectedDataError('badValue', 'package:')
            );
        } finally {
            await adbMock.end();
        }
    });
});
