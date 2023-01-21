import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import TransportCommand from '../../lib/commands/abstract/transport';

class TestCmd extends TransportCommand<null> {
    Cmd = 'test ';
    protected postExecute(): Promise<null> {
        return Promise.resolve(null);
    }
    public execute(serial: string, arg: string): Promise<null> {
        this.Cmd += arg;
        return this.preExecute(serial);
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
