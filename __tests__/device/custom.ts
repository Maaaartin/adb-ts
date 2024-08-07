import TransportCommand from '../../lib/commands/abstract/transport';
import { Connection } from '../../lib/connection';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

class TestCmd extends TransportCommand<null> {
    protected keepAlive = false;
    protected Cmd: string;

    constructor(connection: Connection, serial: string, [arg]: string[]) {
        super(connection, serial);
        this.Cmd = 'test ' + arg;
    }

    protected postExecute(): null {
        return null;
    }
}
describe('Device custom command tests', () => {
    it('Should execute custom command', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: 'test arg',
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).custom(TestCmd, ['arg']);
            expect(result).toBeNull();
        } finally {
            await adbMock.end();
        }
    });
});
