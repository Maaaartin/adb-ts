import { Connection } from '../../lib/connection';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Open tcp tests', () => {
    it('Should open tcp without host', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: 'tcp:5555',
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).openTcp(5555);
            expect(result).toBeInstanceOf(Connection);
        } finally {
            await adbMock.end();
        }
    });

    it('Should open tcp with host', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: 'tcp:localhost:5555',
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).openTcp(5555, 'localhost');
            expect(result).toBeInstanceOf(Connection);
        } finally {
            await adbMock.end();
        }
    });
});
