import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Get ip address tests', () => {
    it('Should get single address', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: "shell:ip route | awk '{ print $9 }'",
                res: '127.0.0.1',
                rawRes: true
            }
        ]);

        try {
            const port = await adbMock.start();
            const result = await getDevice(port).getIpAddress();
            expect(result).toBe('127.0.0.1');
        } finally {
            await adbMock.end();
        }
    });

    it('Should get array of addresses', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: "shell:ip route | awk '{ print $9 }'",
                res: '127.0.0.1\n127.0.0.2',
                rawRes: true
            }
        ]);

        try {
            const port = await adbMock.start();
            const result = await getDevice(port).getIpAddress();
            expect(result).toEqual(['127.0.0.1', '127.0.0.2']);
        } finally {
            await adbMock.end();
        }
    });

    it('Should get null address', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: "shell:ip route | awk '{ print $9 }'",
                res: null,
                rawRes: true
            }
        ]);

        try {
            const port = await adbMock.start();
            const result = await getDevice(port).getIpAddress();
            expect(result).toBeNull();
        } finally {
            await adbMock.end();
        }
    });
});
