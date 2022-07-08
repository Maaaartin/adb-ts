import { mockServer } from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';

describe('IP address', () => {
    it('OKAY', async () => {
        const { port, done } = await mockServer({
            expValue: 'host:transport:serial',
            expValue2: "shell:ip route | awk '{ print $9 }'",
            res2: '127.0.0.1'
        });

        try {
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.getIpAddress('serial');
            expect(result).toBe('127.0.0.1');
        } finally {
            await done();
        }
    });
});
