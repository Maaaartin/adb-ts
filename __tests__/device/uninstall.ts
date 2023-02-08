import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Uninstall tests', () => {
    it('Should uninstall package without options', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm uninstall com.package`,
                res: 'Success\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).uninstall('com.package');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should uninstall package with options', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm uninstall -k com.package`,
                res: 'Success\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).uninstall('com.package', {
                keepCache: true
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should uninstall package after getting Failure response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm uninstall com.package`,
                res: 'Failure\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();

            const result = await getDevice(port).uninstall('com.package');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should uninstall package after getting Failure response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm uninstall com.package`,
                res: 'Unknown package:\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).uninstall('com.package');
            expect(result).toBeUndefined();
        } finally {
            adbMock.end();
        }
    });
});
