import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import TransportCommand from '../../lib/commands/abstract/transport';
import { Connection } from '../../lib/connection';

class TestCmd extends TransportCommand<null> {
    protected keepAlive = false;
    private arg: string;
    constructor(connection: Connection, serial: string, arg: string) {
        super(connection, serial);
        this.arg = arg;
    }
    protected get Cmd(): string {
        return `test ${this.arg}`;
    }
    protected postExecute(): null {
        return null;
    }
}
describe('Custom command tests', () => {
    it('Should execute command', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: 'test arg',
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ port, noAutoStart: true });
            const result = await adb.customTransport(TestCmd, 'serial', 'arg');
            expect(result).toBeNull();
        } finally {
            adbMock.end();
        }
    });
});
